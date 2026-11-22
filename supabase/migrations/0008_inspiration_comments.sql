-- Inspiração declarada (perfume "inspirado em") e comentários dos leitores. Pode rodar mais de uma vez.

-- ——— Inspiração ————————————————————————————————————————————————————————————
-- Preenchida pela editoria no painel. Aponta para um perfume do catálogo ou, se ele ainda não estiver
-- cadastrado, só o nome. Exibida como "a confirmar" quando não houver fonte.
alter table public.perfumes add column if not exists inspired_by_id uuid references public.perfumes (id) on delete set null;
alter table public.perfumes add column if not exists inspired_by_name text check (char_length(inspired_by_name) <= 120);
alter table public.perfumes add column if not exists inspired_note text check (char_length(inspired_note) <= 300);
do $$ begin
  alter table public.perfumes add constraint perfumes_inspired_not_self check (inspired_by_id is null or inspired_by_id <> id);
exception when duplicate_object then null; end $$;

-- ——— Comentários dos leitores ————————————————————————————————————————————
create table if not exists public.comments (
  id bigint generated always as identity primary key,
  perfume_id uuid not null references public.perfumes (id) on delete cascade,
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  author_name text not null default 'Leitor(a)',
  body text not null check (char_length(btrim(body)) between 2 and 1000),
  hidden boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists comments_perfume_idx on public.comments (perfume_id, created_at desc);
create index if not exists comments_user_idx on public.comments (user_id, created_at desc);

-- Autor, data e visibilidade vêm do servidor (não do navegador); limite simples contra abuso.
create or replace function public.comments_before_insert()
returns trigger language plpgsql security definer set search_path = public as $$
declare recent int; today int;
begin
  new.user_id := auth.uid();
  new.created_at := now();
  new.hidden := false;
  new.body := btrim(new.body);
  select coalesce(nullif(btrim(display_name), ''), 'Leitor(a)') into new.author_name from public.profiles where user_id = auth.uid();
  new.author_name := coalesce(new.author_name, 'Leitor(a)');
  select count(*) filter (where created_at > now() - interval '30 seconds'), count(*) filter (where created_at > now() - interval '1 day')
    into recent, today from public.comments where user_id = auth.uid();
  if recent > 0 then raise exception 'Aguarde alguns segundos antes de comentar de novo.'; end if;
  if today >= 20 then raise exception 'Limite de 20 comentários por dia.'; end if;
  return new;
end;
$$;
drop trigger if exists comments_before_insert on public.comments;
create trigger comments_before_insert before insert on public.comments
  for each row execute function public.comments_before_insert();

alter table public.comments enable row level security;
drop policy if exists comments_read on public.comments;
create policy comments_read on public.comments for select
  using ((not hidden and public.perfume_is_public(perfume_id)) or user_id = auth.uid() or public.is_admin());
drop policy if exists comments_insert on public.comments;
create policy comments_insert on public.comments for insert to authenticated
  with check (user_id = auth.uid() and public.perfume_is_public(perfume_id));
drop policy if exists comments_hide on public.comments;
create policy comments_hide on public.comments for update to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists comments_delete on public.comments;
create policy comments_delete on public.comments for delete to authenticated using (user_id = auth.uid() or public.is_admin());

-- Visitantes não veem user_id (só quem está logado, para reconhecer os próprios comentários).
revoke all on public.comments from anon;
grant select (id, perfume_id, author_name, body, hidden, created_at) on public.comments to anon;
grant select on public.comments to authenticated;
grant insert, update, delete on public.comments to authenticated;
grant usage on all sequences in schema public to authenticated;
