-- SECURITY FIX — run once in Supabase: SQL Editor > New query > paste > Run.
--
-- Problem found during end-to-end testing: the "own profile update" RLS policy
-- lets a signed-in user update their own profiles row, and nothing stopped them
-- from changing `role`. Any customer could PATCH their own profile to
-- role = 'admin' and unlock the dispatch CRM.
--
-- Fix: authenticated users may only write name and phone. Role changes are left
-- to the dashboard's service role (Supabase Table Editor still works, because
-- that runs as the service role, not as the logged-in user).

revoke update on public.profiles from authenticated;
grant update (name, phone) on public.profiles to authenticated;

-- Defence in depth: even if a future policy widens column access, block a role
-- change that did not come from the service role.
create or replace function public.prevent_role_self_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.role is distinct from old.role
     and coalesce(current_setting('request.jwt.claims', true)::json ->> 'role', '') <> 'service_role'
  then
    raise exception 'role can only be changed by an administrator';
  end if;
  return new;
end $$;

drop trigger if exists profiles_block_role_change on public.profiles;
create trigger profiles_block_role_change
  before update on public.profiles
  for each row execute function public.prevent_role_self_change();

-- Verify afterwards: signed in as a normal customer, this should now fail.
--   patch /rest/v1/profiles?id=eq.<your-id>  {"role":"admin"}
