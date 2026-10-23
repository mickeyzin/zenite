// Prepara um PGlite que imita o Supabase (papéis anon/authenticated,
// auth.uid(), storage) e aplica a migração.
import fs from "node:fs";

const SUPABASE_MOCK = `
  create role anon nologin; create role authenticated nologin;
  create schema auth;
  create table auth.users (id uuid primary key, email text);
  create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
  grant usage on schema auth to anon, authenticated;
  grant execute on function auth.uid() to anon, authenticated;
  create schema storage;
  create table storage.buckets (id text primary key, name text, public boolean);
  create table storage.objects (id uuid primary key default gen_random_uuid(), bucket_id text, name text);
  alter table storage.objects enable row level security;
`;

// Todas as migrações, em ordem.
const DIR = new URL("../../supabase/migrations/", import.meta.url);
export const migration = () =>
  fs
    .readdirSync(DIR)
    .filter((f) => f.endsWith(".sql"))
    .sort()
    .map((f) => fs.readFileSync(new URL(f, DIR), "utf8"))
    .join("\n")
    .replace(/create extension[^;]+;/, "");

/** PGlite não tem pgcrypto; gen_random_uuid() já é nativo no Postgres 13+. */
export async function prepare(db) {
  await db.exec(SUPABASE_MOCK);
  await db.exec(migration());
}
