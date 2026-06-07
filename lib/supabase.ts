import { createBrowserClient } from "@supabase/ssr";
import { createClient as _createAnonClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Browser client — for use in "use client" components (auth, admin forms)
export function createClient() {
  return createBrowserClient(url, anonKey);
}

// Anon client — no cookies, safe for generateStaticParams and build-time contexts
export function createAnonClient() {
  return _createAnonClient(url, anonKey);
}
