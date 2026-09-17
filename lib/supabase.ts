import { createClient } from "@supabase/supabase-js";

// The client's URL + key come entirely from NEXT_PUBLIC_* env vars at build
// time — nothing is hardcoded, so rotating the key is just an env change +
// rebuild (no code change needed).
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * Browser Supabase client (anon key) — used for progressive waitlist saves from
 * the early-access survey. It's `null` when the env vars are missing so callers
 * can no-op instead of crashing the page (createClient throws on empty values).
 */
export const supabase = url && anonKey ? createClient(url, anonKey) : null;
