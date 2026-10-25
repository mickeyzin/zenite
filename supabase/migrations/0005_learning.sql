-- Aprendizado pelo uso, só com autorização da pessoa. Pode rodar mais de uma vez.

-- Autorização: null = ainda não perguntado; true = autorizou; false = recusou.
alter table public.profiles add column if not exists learning_consent boolean;
alter table public.profiles add column if not exists learning_consent_at timestamptz;

-- Sinais de uso (o que a pessoa leu, comparou, clicou ou pesquisou).
create table if not exists public.user_events (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  kind text not null check (kind in ('view', 'compare', 'offer_click', 'search_note')),
  perfume_id uuid references public.perfumes (id) on delete cascade,
  note text check (char_length(note) <= 80),
  created_at timestamptz not null default now(),
  check ((kind = 'search_note') = (note is not null)),
  check (kind = 'search_note' or perfume_id is not null)
);
create index if not exists user_events_user_idx on public.user_events (user_id, created_at desc);

alter table public.user_events enable row level security;

-- Só grava com autorização ligada; cada pessoa vê e apaga só os próprios sinais.
drop policy if exists user_events_insert on public.user_events;
create policy user_events_insert on public.user_events for insert to authenticated
  with check (
    user_id = auth.uid()
    and exists (select 1 from public.profiles pr where pr.user_id = auth.uid() and pr.learning_consent)
  );
drop policy if exists user_events_select on public.user_events;
create policy user_events_select on public.user_events for select to authenticated using (user_id = auth.uid());
drop policy if exists user_events_delete on public.user_events;
create policy user_events_delete on public.user_events for delete to authenticated using (user_id = auth.uid());

revoke all on public.user_events from anon;
grant select, insert, delete on public.user_events to authenticated;
grant usage on all sequences in schema public to authenticated;

-- Ao desligar a autorização, o histórico é apagado junto.
create or replace function public.learning_consent_off()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if coalesce(old.learning_consent, false) and not coalesce(new.learning_consent, false) then
    delete from public.user_events where user_id = new.user_id;
  end if;
  return new;
end;
$$;
drop trigger if exists profiles_learning_off on public.profiles;
create trigger profiles_learning_off after update of learning_consent on public.profiles
  for each row execute function public.learning_consent_off();

-- Sinais com mais de 180 dias deixam de existir (limpeza feita a cada nova gravação da própria pessoa).
create or replace function public.user_events_retention()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  delete from public.user_events where user_id = new.user_id and created_at < now() - interval '180 days';
  return new;
end;
$$;
drop trigger if exists user_events_retention on public.user_events;
create trigger user_events_retention after insert on public.user_events
  for each row execute function public.user_events_retention();
