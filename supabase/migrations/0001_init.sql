-- ============================================================================
-- Zênite — estrutura inicial do banco (Supabase / Postgres)
--
-- Regras de segurança (RLS):
--   • o público (anon) só LÊ o que está publicado;
--   • só administradores (tabela public.admins) escrevem;
--   • cliques em ofertas podem ser registrados por qualquer visitante.
-- Execute uma vez no SQL Editor do Supabase. Pode ser reexecutado com segurança
-- em um banco novo; não apaga dados existentes.
-- ============================================================================

create extension if not exists pgcrypto;

-- ——— Tipos ———————————————————————————————————————————————————————————————
do $$ begin
  create type public.data_status as enum ('verificado', 'a-confirmar', 'provisorio');
exception when duplicate_object then null; end $$;
do $$ begin
  create type public.publish_status as enum ('rascunho', 'publicado', 'arquivado');
exception when duplicate_object then null; end $$;
do $$ begin
  create type public.note_tier as enum ('top', 'heart', 'base');
exception when duplicate_object then null; end $$;
do $$ begin
  create type public.draft_status as enum ('pendente', 'aprovado', 'rejeitado');
exception when duplicate_object then null; end $$;

-- ——— Administradores ————————————————————————————————————————————————————
create table if not exists public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

-- ——— Atualização automática de updated_at ————————————————————————————————
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end $$;

-- ——— Marcas ——————————————————————————————————————————————————————————————
create table if not exists public.brands (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  website text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ——— Famílias olfativas ———————————————————————————————————————————————————
create table if not exists public.families (
  slug text primary key,
  name text not null
);

-- ——— Acordes e notas ——————————————————————————————————————————————————————
create table if not exists public.accords (
  key text primary key,
  label text not null,
  position smallint not null default 0
);

create table if not exists public.notes (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name_pt text not null,
  name_en text,
  created_at timestamptz not null default now()
);

-- Pesos de cada nota em cada acorde (0–1). Alimenta o perfil estimado.
create table if not exists public.note_accords (
  note_id uuid not null references public.notes (id) on delete cascade,
  accord_key text not null references public.accords (key) on delete cascade,
  weight numeric(4, 3) not null check (weight > 0 and weight <= 1),
  primary key (note_id, accord_key)
);

-- Grafias alternativas (inglês, erros de digitação dos sites) → nota.
create table if not exists public.note_aliases (
  alias text primary key check (alias = lower(alias)),
  note_id uuid not null references public.notes (id) on delete cascade
);

-- ——— Perfumes ————————————————————————————————————————————————————————————
create table if not exists public.perfumes (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  brand_id uuid not null references public.brands (id) on delete restrict,
  line text,
  name text not null,
  full_name text not null,
  concentration text,
  concentration_status public.data_status not null default 'a-confirmar',
  year smallint check (year between 1700 and 2100),
  year_status public.data_status not null default 'a-confirmar',
  year_note text,
  gender text,
  gender_status public.data_status not null default 'a-confirmar',
  gender_note text,
  perfumers text[],
  perfumers_status public.data_status not null default 'a-confirmar',
  perfumers_note text,
  family text,
  family_status public.data_status not null default 'a-confirmar',
  family_note text,
  notes_status public.data_status not null default 'a-confirmar',
  notes_note text,
  intro text,
  intro_status public.data_status not null default 'provisorio',
  intro_note text,
  volume_ml numeric(6, 1),
  sku text,
  -- Apresentação 3D (opcional): universo e materiais do frasco
  universe text,
  theme jsonb,
  look jsonb,
  scene_scale numeric(4, 2) not null default 1,
  front_rotation numeric(6, 3) not null default 0,
  status public.publish_status not null default 'rascunho',
  featured boolean not null default false,
  featured_order smallint,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  published_at timestamptz
);
create index if not exists perfumes_brand_idx on public.perfumes (brand_id);
create index if not exists perfumes_status_idx on public.perfumes (status);

create table if not exists public.perfume_notes (
  perfume_id uuid not null references public.perfumes (id) on delete cascade,
  note_id uuid not null references public.notes (id) on delete restrict,
  tier public.note_tier not null,
  position smallint not null default 0,
  primary key (perfume_id, note_id, tier)
);

create table if not exists public.perfume_sources (
  id uuid primary key default gen_random_uuid(),
  perfume_id uuid not null references public.perfumes (id) on delete cascade,
  field text not null default 'geral',
  label text not null,
  url text not null,
  accessed_at timestamptz not null default now()
);

-- Avaliação editorial (separada dos dados oficiais)
create table if not exists public.reviews (
  perfume_id uuid primary key references public.perfumes (id) on delete cascade,
  status public.data_status not null default 'provisorio',
  status_note text,
  evolution jsonb not null default '[]',   -- [{phase, text}]
  evolution_note text,
  performance jsonb not null default '[]', -- [{key, label, value}]
  seasons text[] not null default '{}',
  occasions text[] not null default '{}',
  pros text[] not null default '{}',
  pros_note text,
  cons text[] not null default '{}',
  cons_note text,
  profile text,
  rating numeric(3, 1) check (rating between 0 and 10),
  rating_note text,
  author_id uuid references auth.users (id) on delete set null,
  updated_at timestamptz not null default now()
);

create table if not exists public.perfume_images (
  id uuid primary key default gen_random_uuid(),
  perfume_id uuid not null references public.perfumes (id) on delete cascade,
  url text not null,
  kind text not null default 'poster' check (kind in ('poster', 'galeria')),
  credit text,
  license text,
  position smallint not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.models_3d (
  perfume_id uuid primary key references public.perfumes (id) on delete cascade,
  desktop_url text not null,
  mobile_url text not null,
  liquid_points_url text,
  updated_at timestamptz not null default now()
);

-- Semelhantes escolhidos pela editoria (somam-se aos calculados)
create table if not exists public.similar_overrides (
  perfume_id uuid not null references public.perfumes (id) on delete cascade,
  similar_id uuid not null references public.perfumes (id) on delete cascade,
  reason text not null,
  primary key (perfume_id, similar_id),
  check (perfume_id <> similar_id)
);

-- ——— Lojas, ofertas e afiliados ——————————————————————————————————————————
create table if not exists public.stores (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  website text,
  affiliate_program text,
  created_at timestamptz not null default now()
);

create table if not exists public.offers (
  id uuid primary key default gen_random_uuid(),
  perfume_id uuid not null references public.perfumes (id) on delete cascade,
  store_id uuid not null references public.stores (id) on delete restrict,
  title text not null,
  volume_ml numeric(6, 1),
  price numeric(10, 2) check (price >= 0),
  currency text not null default 'BRL',
  url text not null,
  affiliate_url text,
  is_affiliate boolean not null default false,
  available boolean not null default true,
  seller_reputation text,
  shipping text,
  checked_at timestamptz,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  -- link de afiliado só vale se marcado como afiliado
  check (affiliate_url is null or is_affiliate)
);
create index if not exists offers_perfume_idx on public.offers (perfume_id);

create table if not exists public.offer_price_history (
  id bigint generated always as identity primary key,
  offer_id uuid not null references public.offers (id) on delete cascade,
  price numeric(10, 2),
  available boolean,
  checked_at timestamptz not null default now()
);

create table if not exists public.offer_clicks (
  id bigint generated always as identity primary key,
  offer_id uuid not null references public.offers (id) on delete cascade,
  clicked_at timestamptz not null default now(),
  page text
);
create index if not exists offer_clicks_offer_idx on public.offer_clicks (offer_id);

-- ——— Rascunhos importados (fila de revisão) ———————————————————————————————
create table if not exists public.import_drafts (
  id uuid primary key default gen_random_uuid(),
  source text not null,              -- ex.: 'lattafa'
  url text not null unique,
  brand_slug text not null,
  payload jsonb not null,            -- dados extraídos (nome, notas, volume…)
  status public.draft_status not null default 'pendente',
  perfume_id uuid references public.perfumes (id) on delete set null,
  fetched_at timestamptz,
  reviewed_by uuid references auth.users (id) on delete set null,
  reviewed_at timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists import_drafts_status_idx on public.import_drafts (status);

-- ——— Histórico de alterações ——————————————————————————————————————————————
create table if not exists public.change_log (
  id bigint generated always as identity primary key,
  table_name text not null,
  row_id text,
  action text not null,
  changed_by uuid default auth.uid(),
  changed_at timestamptz not null default now(),
  data jsonb
);

create or replace function public.log_change()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  rec jsonb;
begin
  rec := case when tg_op = 'DELETE' then to_jsonb(old) else to_jsonb(new) end;
  insert into public.change_log (table_name, row_id, action, data)
  values (tg_table_name, coalesce(rec ->> 'id', rec ->> 'perfume_id'), lower(tg_op), rec);
  return null;
end $$;

-- Gatilhos
do $$
declare t text;
begin
  foreach t in array array['brands', 'perfumes', 'reviews', 'offers', 'models_3d'] loop
    execute format('drop trigger if exists %I_touch on public.%I', t, t);
    execute format('create trigger %I_touch before update on public.%I for each row execute function public.touch_updated_at()', t, t);
  end loop;
  foreach t in array array['perfumes', 'reviews', 'offers', 'perfume_notes', 'import_drafts'] loop
    execute format('drop trigger if exists %I_log on public.%I', t, t);
    execute format('create trigger %I_log after insert or update or delete on public.%I for each row execute function public.log_change()', t, t);
  end loop;
end $$;

-- Data de publicação e histórico de preços automáticos
create or replace function public.perfume_published_at()
returns trigger language plpgsql as $$
begin
  if new.status = 'publicado' and (old is null or old.status <> 'publicado') then
    new.published_at := coalesce(new.published_at, now());
  end if;
  return new;
end $$;
drop trigger if exists perfumes_published on public.perfumes;
create trigger perfumes_published before insert or update on public.perfumes
  for each row execute function public.perfume_published_at();

create or replace function public.offer_price_track()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if tg_op = 'INSERT' or new.price is distinct from old.price or new.available is distinct from old.available then
    insert into public.offer_price_history (offer_id, price, available, checked_at)
    values (new.id, new.price, new.available, coalesce(new.checked_at, now()));
  end if;
  return null;
end $$;
drop trigger if exists offers_price on public.offers;
create trigger offers_price after insert or update on public.offers
  for each row execute function public.offer_price_track();

-- ——— Segurança (RLS) ———————————————————————————————————————————————————————
alter table public.admins enable row level security;
alter table public.brands enable row level security;
alter table public.families enable row level security;
alter table public.accords enable row level security;
alter table public.notes enable row level security;
alter table public.note_accords enable row level security;
alter table public.note_aliases enable row level security;
alter table public.perfumes enable row level security;
alter table public.perfume_notes enable row level security;
alter table public.perfume_sources enable row level security;
alter table public.reviews enable row level security;
alter table public.perfume_images enable row level security;
alter table public.models_3d enable row level security;
alter table public.similar_overrides enable row level security;
alter table public.stores enable row level security;
alter table public.offers enable row level security;
alter table public.offer_price_history enable row level security;
alter table public.offer_clicks enable row level security;
alter table public.import_drafts enable row level security;
alter table public.change_log enable row level security;

-- Visível ao público?
create or replace function public.perfume_is_public(pid uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.perfumes where id = pid and status = 'publicado');
$$;

do $$
declare t text;
begin
  -- Tabelas de referência: leitura pública, escrita só admin
  foreach t in array array['brands', 'families', 'accords', 'notes', 'note_accords', 'note_aliases', 'stores'] loop
    execute format('drop policy if exists %I_read on public.%I', t, t);
    execute format('create policy %I_read on public.%I for select using (true)', t, t);
    execute format('drop policy if exists %I_admin on public.%I', t, t);
    execute format('create policy %I_admin on public.%I for all using (public.is_admin()) with check (public.is_admin())', t, t);
  end loop;
  -- Tabelas ligadas a um perfume: leitura se o perfume estiver publicado
  foreach t in array array['perfume_notes', 'perfume_sources', 'reviews', 'perfume_images', 'models_3d'] loop
    execute format('drop policy if exists %I_read on public.%I', t, t);
    execute format('create policy %I_read on public.%I for select using (public.perfume_is_public(perfume_id) or public.is_admin())', t, t);
    execute format('drop policy if exists %I_admin on public.%I', t, t);
    execute format('create policy %I_admin on public.%I for all using (public.is_admin()) with check (public.is_admin())', t, t);
  end loop;
  -- Só admin
  foreach t in array array['import_drafts', 'change_log', 'offer_price_history', 'admins'] loop
    execute format('drop policy if exists %I_admin on public.%I', t, t);
    execute format('create policy %I_admin on public.%I for all using (public.is_admin()) with check (public.is_admin())', t, t);
  end loop;
end $$;

drop policy if exists perfumes_read on public.perfumes;
create policy perfumes_read on public.perfumes for select using (status = 'publicado' or public.is_admin());
drop policy if exists perfumes_admin on public.perfumes;
create policy perfumes_admin on public.perfumes for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists similar_read on public.similar_overrides;
create policy similar_read on public.similar_overrides for select
  using ((public.perfume_is_public(perfume_id) and public.perfume_is_public(similar_id)) or public.is_admin());
drop policy if exists similar_admin on public.similar_overrides;
create policy similar_admin on public.similar_overrides for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists offers_read on public.offers;
create policy offers_read on public.offers for select using ((active and public.perfume_is_public(perfume_id)) or public.is_admin());
drop policy if exists offers_admin on public.offers;
create policy offers_admin on public.offers for all using (public.is_admin()) with check (public.is_admin());

-- Cliques: qualquer visitante registra; só admin lê
drop policy if exists offer_clicks_insert on public.offer_clicks;
create policy offer_clicks_insert on public.offer_clicks for insert to anon, authenticated
  with check (exists (select 1 from public.offers o where o.id = offer_id and o.active));
drop policy if exists offer_clicks_admin on public.offer_clicks;
create policy offer_clicks_admin on public.offer_clicks for select using (public.is_admin());

-- Permissões de tabela (o RLS acima é quem filtra as linhas)
grant usage on schema public to anon, authenticated;
grant select on all tables in schema public to anon, authenticated;
grant insert, update, delete on all tables in schema public to authenticated;
grant insert on public.offer_clicks to anon;
grant usage on all sequences in schema public to anon, authenticated;
revoke select on public.import_drafts, public.change_log, public.admins, public.offer_price_history from anon;

-- ——— Armazenamento de imagens (bucket público de leitura) ———————————————————
insert into storage.buckets (id, name, public)
values ('perfumes', 'perfumes', true)
on conflict (id) do nothing;

drop policy if exists perfumes_bucket_read on storage.objects;
create policy perfumes_bucket_read on storage.objects for select using (bucket_id = 'perfumes');
drop policy if exists perfumes_bucket_admin on storage.objects;
create policy perfumes_bucket_admin on storage.objects for all to authenticated
  using (bucket_id = 'perfumes' and public.is_admin())
  with check (bucket_id = 'perfumes' and public.is_admin());

-- ——— Funções do painel ——————————————————————————————————————————————————————
-- Normaliza nomes de notas como o site (minúsculas, sem acentos, sem ™/®).
create or replace function public.norm_note(s text)
returns text language sql immutable set search_path = public as $$
  select trim(regexp_replace(translate(lower(s), 'áàâãäåéèêëíìîïóòôõöúùûüçñ™®', 'aaaaaaeeeeiiiiooooouuuucn'), '\s+', ' ', 'g'));
$$;

create or replace function public.slugify(s text)
returns text language sql immutable set search_path = public as $$
  select trim(both '-' from regexp_replace(public.norm_note(s), '[^a-z0-9]+', '-', 'g'));
$$;

-- Encontra a nota pelo nome (ou apelido); cria se não existir, sem acordes,
-- para ser classificada no painel.
create or replace function public.resolve_note(name text)
returns uuid language plpgsql security invoker set search_path = public as $$
declare nid uuid;
begin
  if coalesce(trim(name), '') = '' then return null; end if;
  select note_id into nid from public.note_aliases where alias = public.norm_note(name);
  if nid is not null then return nid; end if;
  insert into public.notes (slug, name_pt) values (public.slugify(name), trim(name))
  on conflict (slug) do update set slug = excluded.slug
  returning id into nid;
  insert into public.note_aliases (alias, note_id) values (public.norm_note(name), nid) on conflict do nothing;
  return nid;
end;
$$;

-- Substitui a pirâmide de um perfume.
create or replace function public.set_perfume_notes(pid uuid, top text[], heart text[], base text[])
returns void language plpgsql security invoker set search_path = public as $$
declare t text; list text[]; i int; nid uuid;
begin
  if not public.is_admin() then raise exception 'acesso negado'; end if;
  delete from public.perfume_notes where perfume_id = pid;
  foreach t in array array['top', 'heart', 'base'] loop
    list := case t when 'top' then top when 'heart' then heart else base end;
    for i in 1 .. coalesce(array_length(list, 1), 0) loop
      nid := public.resolve_note(list[i]);
      if nid is not null then
        insert into public.perfume_notes (perfume_id, note_id, tier, position)
        values (pid, nid, t::public.note_tier, i - 1) on conflict do nothing;
      end if;
    end loop;
  end loop;
end;
$$;

-- Aprova um rascunho importado: cria o perfume (como rascunho, não publicado),
-- liga as notas pelos apelidos e cria as notas que faltarem (sem acordes, para
-- classificar no painel). Roda com as permissões de quem chama (RLS vale).
create or replace function public.approve_draft(draft uuid)
returns uuid language plpgsql security invoker set search_path = public as $$
declare
  d public.import_drafts;
  b public.brands;
  pid uuid;
  size_ml numeric;
begin
  if not public.is_admin() then raise exception 'acesso negado'; end if;
  select * into d from public.import_drafts where id = draft for update;
  if not found then raise exception 'rascunho não encontrado'; end if;
  if d.perfume_id is not null then return d.perfume_id; end if;
  if coalesce(d.payload->>'name', '') = '' then raise exception 'rascunho sem nome'; end if;

  select * into b from public.brands where slug = d.brand_slug;
  if not found then
    insert into public.brands (slug, name) values (d.brand_slug, initcap(replace(d.brand_slug, '-', ' '))) returning * into b;
  end if;

  size_ml := nullif(replace(regexp_replace(coalesce(d.payload->>'size', ''), '[^0-9.,]', '', 'g'), ',', '.'), '')::numeric;

  insert into public.perfumes (slug, brand_id, name, full_name, sku, volume_ml, gender, gender_status,
                               notes_status, notes_note, status)
  values (public.slugify(b.name || ' ' || (d.payload->>'name')), b.id, d.payload->>'name', b.name || ' ' || (d.payload->>'name'),
          d.payload->>'sku', size_ml, d.payload->>'gender',
          case when d.payload->>'gender' is not null then 'verificado'::public.data_status else 'a-confirmar' end,
          case when d.payload->'notes' is not null and d.payload->'notes' <> 'null' then 'verificado'::public.data_status else 'a-confirmar' end,
          'Pirâmide do site oficial da marca.', 'rascunho')
  on conflict (slug) do update set updated_at = now()
  returning id into pid;

  insert into public.perfume_sources (perfume_id, field, label, url)
  select pid, 'notas', 'Site oficial (' || b.name || ')', d.url
  where not exists (select 1 from public.perfume_sources where perfume_id = pid and url = d.url);

  if jsonb_typeof(d.payload->'notes') = 'object' then
    perform public.set_perfume_notes(pid,
      array(select jsonb_array_elements_text(coalesce(d.payload->'notes'->'top', '[]'))),
      array(select jsonb_array_elements_text(coalesce(d.payload->'notes'->'heart', '[]'))),
      array(select jsonb_array_elements_text(coalesce(d.payload->'notes'->'base', '[]'))));
  end if;

  update public.import_drafts
     set status = 'aprovado', perfume_id = pid, reviewed_by = auth.uid(), reviewed_at = now()
   where id = draft;
  return pid;
end;
$$;

revoke execute on function public.approve_draft(uuid) from public, anon;
revoke execute on function public.resolve_note(text) from public, anon;
revoke execute on function public.set_perfume_notes(uuid, text[], text[], text[]) from public, anon;
grant execute on function public.approve_draft(uuid) to authenticated;
grant execute on function public.resolve_note(text) to authenticated;
grant execute on function public.set_perfume_notes(uuid, text[], text[], text[]) to authenticated;
