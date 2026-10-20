/**
 * Configuração pública do Supabase. As duas variáveis são públicas por
 * natureza (a chave anon/publishable só permite o que as regras RLS do banco
 * deixam). Nunca coloque a chave service_role no site.
 */
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

/** Sem as variáveis, o site usa os dados locais de src/data. */
export const supabaseEnabled = Boolean(SUPABASE_URL && SUPABASE_KEY);
