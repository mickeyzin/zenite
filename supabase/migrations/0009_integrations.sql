-- Conexões com serviços externos (hoje: Mercado Livre, para buscar a foto do anúncio pela API oficial).
-- Só administradores leem e gravam. Pode rodar mais de uma vez.
create table if not exists public.integration_tokens (
  provider text primary key check (provider in ('mercadolivre')),
  access_token text not null,
  refresh_token text,
  expires_at timestamptz not null,
  account_id text,
  updated_at timestamptz not null default now()
);
alter table public.integration_tokens enable row level security;
drop policy if exists integration_tokens_admin on public.integration_tokens;
create policy integration_tokens_admin on public.integration_tokens for all to authenticated
  using (public.is_admin()) with check (public.is_admin());
revoke all on public.integration_tokens from anon;
grant select, insert, update, delete on public.integration_tokens to authenticated;
