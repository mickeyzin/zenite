-- Contas de visitantes: perfil olfativo e armário de perfumes.
-- Cada pessoa só vê e altera os próprios dados (RLS). Pode rodar mais de uma vez.

-- ——— Perfil ———————————————————————————————————————————————————————————————
create table if not exists public.profiles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  display_name text check (char_length(display_name) <= 60),
  quiz_answers jsonb,            -- respostas do mapa olfativo (famílias, notas, intensidade…)
  quiz_profile jsonb,            -- perfil de acordes calculado a partir das respostas
  quiz_updated_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists profiles_touch on public.profiles;
create trigger profiles_touch before update on public.profiles
  for each row execute function public.touch_updated_at();

-- ——— Armário ——————————————————————————————————————————————————————————————
do $$ begin
  create type public.wardrobe_status as enum ('tenho', 'gostei', 'nao_gostei', 'quero');
exception when duplicate_object then null; end $$;

create table if not exists public.wardrobe (
  user_id uuid not null references auth.users (id) on delete cascade,
  perfume_id uuid not null references public.perfumes (id) on delete cascade,
  status public.wardrobe_status not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, perfume_id)
);
create index if not exists wardrobe_user_idx on public.wardrobe (user_id);

drop trigger if exists wardrobe_touch on public.wardrobe;
create trigger wardrobe_touch before update on public.wardrobe
  for each row execute function public.touch_updated_at();

-- ——— Segurança ————————————————————————————————————————————————————————————
alter table public.profiles enable row level security;
alter table public.wardrobe enable row level security;

drop policy if exists profiles_own on public.profiles;
create policy profiles_own on public.profiles for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists wardrobe_own on public.wardrobe;
create policy wardrobe_own on public.wardrobe for all to authenticated
  using (user_id = auth.uid())
  -- só perfumes publicados entram no armário
  with check (user_id = auth.uid() and public.perfume_is_public(perfume_id));

revoke all on public.profiles, public.wardrobe from anon;
grant select, insert, update, delete on public.profiles, public.wardrobe to authenticated;

-- ——— Apagar a própria conta (LGPD) ————————————————————————————————————————
-- Remove o usuário; perfil e armário saem junto (on delete cascade).
create or replace function public.delete_my_account()
returns void language plpgsql security definer set search_path = public, auth as $$
begin
  if auth.uid() is null then raise exception 'sem sessão'; end if;
  if exists (select 1 from public.admins where user_id = auth.uid()) then
    raise exception 'contas de administrador não podem ser apagadas por aqui';
  end if;
  delete from auth.users where id = auth.uid();
end;
$$;
revoke execute on function public.delete_my_account() from public, anon;
grant execute on function public.delete_my_account() to authenticated;
