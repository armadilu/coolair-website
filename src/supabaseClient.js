import { createClient } from "@supabase/supabase-js";

// Publishable key — safe to ship in client code (RLS protects the data).
// Env vars override these (set them on Netlify too if you rotate keys).
const url = import.meta.env.VITE_SUPABASE_URL || "https://gxztworyxzgsguwytrng.supabase.co";
const key = import.meta.env.VITE_SUPABASE_ANON_KEY || "sb_publishable_Dcc4U4-SZQRUQrE9Gp2XyQ_37sxwwKT";

export const supabase = createClient(url, key);
