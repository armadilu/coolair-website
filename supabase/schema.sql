-- CoolAir Co. database schema (blueprint §8)
-- Run this ONCE in Supabase: Dashboard → SQL Editor → New query → paste → Run.

-- ── Profiles (extends auth.users with name/phone/role) ──────────
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  phone text,
  role text not null default 'customer' check (role in ('customer','admin','technician')),
  created_at timestamptz not null default now()
);

-- Auto-create a profile whenever someone signs up
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, name)
  values (new.id, coalesce(new.raw_user_meta_data->>'name', split_part(new.email,'@',1)))
  on conflict (id) do nothing;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ── Core tables ──────────────────────────────────────────────────
create table if not exists public.addresses (
  id bigint generated always as identity primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  line1 text not null, city text, zip text,
  created_at timestamptz not null default now()
);

create table if not exists public.services (
  slug text primary key,
  name text not null, description text, category text,
  base_price numeric not null default 0
);

create table if not exists public.products (
  id bigint generated always as identity primary key,
  brand text not null, model text not null,
  seer numeric, tons numeric, price numeric not null,
  stock int not null default 0, image_url text
);

create table if not exists public.bookings (
  id bigint generated always as identity primary key,
  user_id uuid references public.profiles(id) on delete set null,
  service_slug text references public.services(slug),
  technician_id uuid references public.profiles(id),
  customer_name text, phone text, zip text,
  slot text, notes text,
  status text not null default 'requested'
    check (status in ('requested','scheduled','in_progress','completed','cancelled')),
  created_at timestamptz not null default now()
);

create table if not exists public.orders (
  id bigint generated always as identity primary key,
  user_id uuid references public.profiles(id) on delete set null,
  product_id bigint references public.products(id),
  quantity int not null default 1,
  status text not null default 'quote_requested',
  payment_ref text,
  created_at timestamptz not null default now()
);

create table if not exists public.reviews (
  id bigint generated always as identity primary key,
  booking_id bigint references public.bookings(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete set null,
  rating int not null check (rating between 1 and 5),
  text text,
  created_at timestamptz not null default now()
);

create table if not exists public.invoices (
  id bigint generated always as identity primary key,
  booking_id bigint references public.bookings(id) on delete set null,
  user_id uuid references public.profiles(id) on delete set null,
  amount numeric not null, status text not null default 'unpaid',
  payment_ref text,
  created_at timestamptz not null default now()
);

create table if not exists public.maintenance_plans (
  id bigint generated always as identity primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  plan_type text not null default 'coolcare',
  renews_on date,
  created_at timestamptz not null default now()
);

create table if not exists public.chat_logs (
  id bigint generated always as identity primary key,
  user_id uuid references public.profiles(id) on delete set null,
  transcript jsonb,
  urgency text,
  created_at timestamptz not null default now()
);

create table if not exists public.service_areas (
  zip text primary key,
  zone text not null,
  response text not null default 'Next day'
);

-- ── Row Level Security ───────────────────────────────────────────
alter table public.profiles enable row level security;
alter table public.addresses enable row level security;
alter table public.services enable row level security;
alter table public.products enable row level security;
alter table public.bookings enable row level security;
alter table public.orders enable row level security;
alter table public.reviews enable row level security;
alter table public.invoices enable row level security;
alter table public.maintenance_plans enable row level security;
alter table public.chat_logs enable row level security;
alter table public.service_areas enable row level security;

create or replace function public.is_staff()
returns boolean language sql stable security definer set search_path = public as
$$ select exists (select 1 from public.profiles where id = auth.uid() and role in ('admin','technician')) $$;

-- Public catalog data: anyone can read
create policy "services readable" on public.services for select using (true);
create policy "products readable" on public.products for select using (true);
create policy "areas readable" on public.service_areas for select using (true);
create policy "reviews readable" on public.reviews for select using (true);

-- Profiles: own row (staff can read all)
create policy "own profile read" on public.profiles for select using (auth.uid() = id or public.is_staff());
create policy "own profile update" on public.profiles for update using (auth.uid() = id);

-- Bookings: customers see/insert their own; staff see and update all
create policy "own bookings read" on public.bookings for select using (auth.uid() = user_id or public.is_staff());
create policy "own bookings insert" on public.bookings for insert with check (auth.uid() = user_id);
create policy "staff bookings update" on public.bookings for update using (public.is_staff());

-- Orders / invoices / plans / addresses / chat logs: own rows (staff read all)
create policy "own orders" on public.orders for select using (auth.uid() = user_id or public.is_staff());
create policy "own orders insert" on public.orders for insert with check (auth.uid() = user_id);
create policy "own invoices" on public.invoices for select using (auth.uid() = user_id or public.is_staff());
create policy "own plans" on public.maintenance_plans for select using (auth.uid() = user_id or public.is_staff());
create policy "own addresses" on public.addresses for all using (auth.uid() = user_id);
create policy "own chats insert" on public.chat_logs for insert with check (user_id is null or auth.uid() = user_id);
create policy "own chats read" on public.chat_logs for select using (auth.uid() = user_id or public.is_staff());
create policy "own reviews insert" on public.reviews for insert with check (auth.uid() = user_id);

-- ── Seed data ────────────────────────────────────────────────────
insert into public.services (slug, name, description, category, base_price) values
  ('repair','AC Repair','Same-day diagnosis and repair','repair',89),
  ('installation','Installation & Replacement','New high-SEER systems installed','install',4900),
  ('maintenance','Maintenance Plans','CoolCare seasonal tune-ups','maintenance',14),
  ('duct-cleaning','Duct Cleaning','Whole-home duct cleaning','cleaning',349),
  ('air-quality','Indoor Air Quality','Purifiers, filtration, humidity','iaq',299)
on conflict (slug) do nothing;

insert into public.products (brand, model, seer, tons, price, stock, image_url) values
  ('Carrier','Comfort 15',15.2,2.5,3450,6,'/products/carrier-comfort-15.jpg'),
  ('Trane','XR16',16.2,3,4200,4,'/products/trane-xr16.jpg'),
  ('Lennox','EL22XPV',22.0,3,6800,2,'/products/lennox-el22xpv.jpg'),
  ('Goodman','GSXN4',14.3,2,2750,9,'/products/goodman-gsxn4.jpg'),
  ('Rheem','RA17',17.0,3.5,4950,3,'/products/rheem-ra17.jpg'),
  ('Carrier','Infinity 26',26.0,4,8900,1,'/products/carrier-infinity-26.jpg');

insert into public.service_areas (zip, zone, response) values
  ('75001','Central Metro','Same day'),('75002','Central Metro','Same day'),
  ('75006','Central Metro','Same day'),('75010','Central Metro','Same day'),
  ('75023','North Suburbs','Same day'),('75024','North Suburbs','Same day'),
  ('75025','North Suburbs','Same day'),('75093','North Suburbs','Same day'),
  ('75040','East County','Next day'),('75041','East County','Next day'),
  ('75043','East County','Next day'),('75088','East County','Next day'),
  ('75019','West County','Next day'),('75038','West County','Next day'),
  ('75061','West County','Next day'),('75062','West County','Next day')
on conflict (zip) do nothing;
