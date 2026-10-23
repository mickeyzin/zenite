-- Imagem ilustrativa de cada nota (enviada pelo painel, aba Notas).
-- Pode rodar mais de uma vez sem problema.
alter table public.notes add column if not exists image_url text;
alter table public.notes add column if not exists image_credit text;
