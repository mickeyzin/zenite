"use client";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { SUPABASE_KEY, SUPABASE_URL, supabaseEnabled } from "./config";

let browser: SupabaseClient | null = null;

/** Cliente do navegador (painel). A sessão fica no armazenamento local. */
export function browserClient() {
  if (!supabaseEnabled) return null;
  browser ??= createClient(SUPABASE_URL, SUPABASE_KEY, { auth: { persistSession: true, autoRefreshToken: true } });
  return browser;
}
