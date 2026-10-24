-- Foto de cada oferta (enviada pelo painel, aba Ofertas). Pode rodar mais de uma vez.
alter table public.offers add column if not exists image_url text;
alter table public.offers add column if not exists image_credit text;
