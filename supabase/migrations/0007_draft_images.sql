-- Fotos dos rascunhos (ex.: Wikimedia Commons, com crédito e licença). Pode rodar mais de uma vez.
-- Campos opcionais do rascunho: imageUrl, imageCredit (obrigatório se houver foto), imageLicense, imagePage.
-- A foto só entra como pôster se o perfume ainda não tiver um.

create or replace function public.draft_poster(pid uuid, payload jsonb)
returns void language plpgsql security invoker set search_path = public as $$
begin
  if coalesce(payload->>'imageUrl', '') = '' or coalesce(payload->>'imageCredit', '') = '' then return; end if;
  if exists (select 1 from public.perfume_images where perfume_id = pid and kind = 'poster') then return; end if;
  insert into public.perfume_images (perfume_id, url, kind, credit, license)
  values (pid, payload->>'imageUrl', 'poster', payload->>'imageCredit',
          nullif(trim(coalesce(payload->>'imageLicense', '') || ' ' || coalesce(payload->>'imagePage', '')), ''));
end;
$$;
revoke execute on function public.draft_poster(uuid, jsonb) from public, anon;
grant execute on function public.draft_poster(uuid, jsonb) to authenticated;

-- Mesma aprovação da 0006, agora com a foto.
create or replace function public.approve_draft(draft uuid)
returns uuid language plpgsql security invoker set search_path = public as $$
declare
  d public.import_drafts;
  b public.brands;
  pid uuid;
  existed boolean;
  size_ml numeric;
  src text;
  yr int;
  slug_ text;
begin
  if not public.is_admin() then raise exception 'acesso negado'; end if;
  select * into d from public.import_drafts where id = draft for update;
  if not found then raise exception 'rascunho não encontrado'; end if;
  if d.perfume_id is not null then return d.perfume_id; end if;
  if coalesce(d.payload->>'name', '') = '' then raise exception 'rascunho sem nome'; end if;

  select * into b from public.brands where slug = d.brand_slug;
  if not found then
    insert into public.brands (slug, name)
    values (d.brand_slug, coalesce(nullif(d.payload->>'brandName', ''), initcap(replace(d.brand_slug, '-', ' '))))
    returning * into b;
  end if;

  src := coalesce(nullif(d.payload->>'sourceLabel', ''), 'Site oficial (' || b.name || ')');
  size_ml := nullif(replace(regexp_replace(coalesce(d.payload->>'size', ''), '[^0-9.,]', '', 'g'), ',', '.'), '')::numeric;
  yr := case when coalesce(d.payload->>'year', '') ~ '^\d{4}$' then (d.payload->>'year')::int end;
  slug_ := public.slugify(b.name || ' ' || (d.payload->>'name'));

  select id into pid from public.perfumes where slug = slug_;
  existed := found;

  if not existed then
    insert into public.perfumes (slug, brand_id, name, full_name, sku, volume_ml, gender, gender_status,
                                 year, year_status, year_note, perfumers, perfumers_status, perfumers_note,
                                 notes_status, notes_note, status)
    values (slug_, b.id, d.payload->>'name', b.name || ' ' || (d.payload->>'name'),
            d.payload->>'sku', size_ml, d.payload->>'gender',
            case when d.payload->>'gender' is not null and d.payload->>'sourceLabel' is null then 'verificado'::public.data_status else 'a-confirmar' end,
            yr, 'a-confirmar', case when yr is not null then 'Fonte: ' || src end,
            case when jsonb_typeof(d.payload->'perfumers') = 'array' then array(select jsonb_array_elements_text(d.payload->'perfumers')) end,
            'a-confirmar', case when jsonb_typeof(d.payload->'perfumers') = 'array' then 'Fonte: ' || src end,
            case
              when nullif(d.payload->>'notesStatus', '') is not null then (d.payload->>'notesStatus')::public.data_status
              when jsonb_typeof(d.payload->'notes') = 'object' then 'verificado'::public.data_status
              else 'a-confirmar'
            end,
            coalesce(nullif(d.payload->>'notesNote', ''), 'Pirâmide do site oficial da marca.'),
            'rascunho')
    returning id into pid;

    perform public.draft_poster(pid, d.payload);

    if jsonb_typeof(d.payload->'notes') = 'object' then
      perform public.set_perfume_notes(pid,
        array(select jsonb_array_elements_text(coalesce(d.payload->'notes'->'top', '[]'))),
        array(select jsonb_array_elements_text(coalesce(d.payload->'notes'->'heart', '[]'))),
        array(select jsonb_array_elements_text(coalesce(d.payload->'notes'->'base', '[]'))));
    end if;
  end if;

  insert into public.perfume_sources (perfume_id, field, label, url)
  select pid, 'notas', src, d.url
  where not exists (select 1 from public.perfume_sources where perfume_id = pid and url = d.url);

  update public.import_drafts
     set status = 'aprovado', perfume_id = pid, reviewed_by = auth.uid(), reviewed_at = now()
   where id = draft;
  return pid;
end;
$$;

revoke execute on function public.approve_draft(uuid) from public, anon;
grant execute on function public.approve_draft(uuid) to authenticated;

-- Rascunhos já aprovados antes desta atualização: acrescenta a foto que faltava.
select public.draft_poster(d.perfume_id, d.payload)
from public.import_drafts d
where d.status = 'aprovado' and d.perfume_id is not null and d.payload ? 'imageUrl';
