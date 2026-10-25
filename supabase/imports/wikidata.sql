-- Gerado por scripts/db/build-seed.ts — rascunhos de Wikidata (várias marcas) (com as notas necessárias). Pode rodar mais de uma vez.
begin;
insert into public.accords (key, label, position) values ('citrico', 'Cítrico', 0) on conflict (key) do update set label = excluded.label;
insert into public.accords (key, label, position) values ('frutado', 'Frutado', 1) on conflict (key) do update set label = excluded.label;
insert into public.accords (key, label, position) values ('floral', 'Floral', 2) on conflict (key) do update set label = excluded.label;
insert into public.accords (key, label, position) values ('verde', 'Verde', 3) on conflict (key) do update set label = excluded.label;
insert into public.accords (key, label, position) values ('aromatico', 'Aromático', 4) on conflict (key) do update set label = excluded.label;
insert into public.accords (key, label, position) values ('especiado', 'Especiado', 5) on conflict (key) do update set label = excluded.label;
insert into public.accords (key, label, position) values ('amadeirado', 'Amadeirado', 6) on conflict (key) do update set label = excluded.label;
insert into public.accords (key, label, position) values ('ambarado', 'Ambarado', 7) on conflict (key) do update set label = excluded.label;
insert into public.accords (key, label, position) values ('doce', 'Doce', 8) on conflict (key) do update set label = excluded.label;
insert into public.accords (key, label, position) values ('almiscarado', 'Almiscarado', 9) on conflict (key) do update set label = excluded.label;
insert into public.notes (slug, name_pt, name_en) values ('abacaxi', 'Abacaxi', 'Pineapple') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'abacaxi'), 'frutado', 1) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('abacaxi', (select id from public.notes where slug = 'abacaxi')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('abeto', 'Abeto', 'Fir') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'abeto'), 'amadeirado', 0.6) on conflict do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'abeto'), 'verde', 0.4) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('abeto', (select id from public.notes where slug = 'abeto')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('acafrao', 'Açafrão', 'Saffron') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'acafrao'), 'especiado', 0.7) on conflict do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'acafrao'), 'ambarado', 0.3) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('acafrao', (select id from public.notes where slug = 'acafrao')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('acucar', 'Açúcar', 'Sugar') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'acucar'), 'doce', 1) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('acucar', (select id from public.notes where slug = 'acucar')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('alcaravia', 'Alcaravia', 'Caraway') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'alcaravia'), 'especiado', 1) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('alcaravia', (select id from public.notes where slug = 'alcaravia')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('alcatrao-de-betula', 'Alcatrão de bétula', 'Birch Tar') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'alcatrao-de-betula'), 'amadeirado', 0.6) on conflict do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'alcatrao-de-betula'), 'ambarado', 0.4) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('alcatrao de betula', (select id from public.notes where slug = 'alcatrao-de-betula')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('aldeidos', 'Aldeídos', 'Aldehydes') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'aldeidos'), 'almiscarado', 0.6) on conflict do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'aldeidos'), 'floral', 0.4) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('aldeidos', (select id from public.notes where slug = 'aldeidos')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('alecrim', 'Alecrim', 'Rosemary') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'alecrim'), 'aromatico', 1) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('alecrim', (select id from public.notes where slug = 'alecrim')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('algodao-doce', 'Algodão-doce', 'Cotton Candy') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'algodao-doce'), 'doce', 1) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('algodao-doce', (select id from public.notes where slug = 'algodao-doce')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('almiscar', 'Almíscar', 'Musk') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'almiscar'), 'almiscarado', 1) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('almiscar', (select id from public.notes where slug = 'almiscar')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('almiscar-branco', 'Almíscar branco', 'White Musk') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'almiscar-branco'), 'almiscarado', 1) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('almiscar branco', (select id from public.notes where slug = 'almiscar-branco')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('ambar', 'Âmbar', 'Amber') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'ambar'), 'ambarado', 1) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('ambar', (select id from public.notes where slug = 'ambar')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('ambar-branco', 'Âmbar branco', 'White Amber') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'ambar-branco'), 'ambarado', 0.7) on conflict do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'ambar-branco'), 'almiscarado', 0.3) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('ambar branco', (select id from public.notes where slug = 'ambar-branco')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('ambar-seco', 'Âmbar seco', 'Amber Dry') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'ambar-seco'), 'ambarado', 0.8) on conflict do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'ambar-seco'), 'amadeirado', 0.2) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('ambar seco', (select id from public.notes where slug = 'ambar-seco')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('ambar-gris', 'Âmbar-gris', 'Ambergis') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'ambar-gris'), 'ambarado', 0.6) on conflict do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'ambar-gris'), 'almiscarado', 0.4) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('ambar-gris', (select id from public.notes where slug = 'ambar-gris')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('amberwood', 'Amberwood', 'Amberwood') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'amberwood'), 'amadeirado', 0.5) on conflict do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'amberwood'), 'ambarado', 0.5) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('amberwood', (select id from public.notes where slug = 'amberwood')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('ambreta', 'Ambreta', 'Ambrette') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'ambreta'), 'almiscarado', 0.7) on conflict do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'ambreta'), 'frutado', 0.3) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('ambreta', (select id from public.notes where slug = 'ambreta')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('ambrofix', 'Ambrofix™', 'Ambrofix') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'ambrofix'), 'ambarado', 0.7) on conflict do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'ambrofix'), 'amadeirado', 0.3) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('ambrofix', (select id from public.notes where slug = 'ambrofix')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('ambroxan', 'Ambroxan', 'Ambrox') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'ambroxan'), 'ambarado', 0.6) on conflict do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'ambroxan'), 'amadeirado', 0.4) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('ambroxan', (select id from public.notes where slug = 'ambroxan')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('ameixa', 'Ameixa', 'Plum') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'ameixa'), 'frutado', 0.8) on conflict do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'ameixa'), 'doce', 0.2) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('ameixa', (select id from public.notes where slug = 'ameixa')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('amendoa', 'Amêndoa', 'Almond') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'amendoa'), 'doce', 1) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('amendoa', (select id from public.notes where slug = 'amendoa')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('amendoa-amarga', 'Amêndoa amarga', 'Bitter Almond') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'amendoa-amarga'), 'doce', 0.8) on conflict do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'amendoa-amarga'), 'frutado', 0.2) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('amendoa amarga', (select id from public.notes where slug = 'amendoa-amarga')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('amora', 'Amora', 'Blackberry') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'amora'), 'frutado', 1) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('amora', (select id from public.notes where slug = 'amora')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('anis', 'Anis', 'Anise') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'anis'), 'especiado', 0.6) on conflict do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'anis'), 'aromatico', 0.4) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('anis', (select id from public.notes where slug = 'anis')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('anis-estrelado', 'Anis-estrelado', 'Star Anise') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'anis-estrelado'), 'especiado', 0.6) on conflict do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'anis-estrelado'), 'doce', 0.4) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('anis-estrelado', (select id from public.notes where slug = 'anis-estrelado')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('arroz', 'Arroz', 'Rice') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'arroz'), 'doce', 0.6) on conflict do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'arroz'), 'almiscarado', 0.4) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('arroz', (select id from public.notes where slug = 'arroz')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('artemisia', 'Artemísia', 'Artemisia') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'artemisia'), 'aromatico', 0.7) on conflict do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'artemisia'), 'verde', 0.3) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('artemisia', (select id from public.notes where slug = 'artemisia')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('avela', 'Avelã', 'Hazelnut') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'avela'), 'doce', 1) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('avela', (select id from public.notes where slug = 'avela')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('baga-timur', 'Baga timur', 'Timur Berry') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'baga-timur'), 'especiado', 0.6) on conflict do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'baga-timur'), 'citrico', 0.4) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('baga timur', (select id from public.notes where slug = 'baga-timur')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('balsamo', 'Bálsamo', 'Balsam') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'balsamo'), 'ambarado', 0.7) on conflict do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'balsamo'), 'doce', 0.3) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('balsamo', (select id from public.notes where slug = 'balsamo')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('balsamo-de-abeto', 'Bálsamo de abeto', 'Fir Balsam') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'balsamo-de-abeto'), 'ambarado', 0.5) on conflict do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'balsamo-de-abeto'), 'amadeirado', 0.3) on conflict do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'balsamo-de-abeto'), 'verde', 0.2) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('balsamo de abeto', (select id from public.notes where slug = 'balsamo-de-abeto')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('balsamo-de-tolu', 'Bálsamo-de-tolu', 'Tolu Balsam') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'balsamo-de-tolu'), 'ambarado', 0.6) on conflict do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'balsamo-de-tolu'), 'doce', 0.4) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('balsamo-de-tolu', (select id from public.notes where slug = 'balsamo-de-tolu')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('bambu', 'Bambu', 'Bamboo') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'bambu'), 'verde', 1) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('bambu', (select id from public.notes where slug = 'bambu')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('banana', 'Banana', 'Banana') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'banana'), 'frutado', 0.7) on conflict do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'banana'), 'doce', 0.3) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('banana', (select id from public.notes where slug = 'banana')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('baunilha', 'Baunilha', 'Vanila') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'baunilha'), 'doce', 1) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('baunilha', (select id from public.notes where slug = 'baunilha')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('baunilha-bourbon', 'Baunilha Bourbon', 'Bourbon Vanilla') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'baunilha-bourbon'), 'doce', 1) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('baunilha bourbon', (select id from public.notes where slug = 'baunilha-bourbon')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('baunilha-de-madagascar', 'Baunilha de Madagascar', 'Madagascar Vanilla') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'baunilha-de-madagascar'), 'doce', 1) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('baunilha de madagascar', (select id from public.notes where slug = 'baunilha-de-madagascar')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('benjoim', 'Benjoim', 'Benzoin') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'benjoim'), 'ambarado', 0.6) on conflict do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'benjoim'), 'doce', 0.4) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('benjoim', (select id from public.notes where slug = 'benjoim')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('bergamota', 'Bergamota', 'Bergamot') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'bergamota'), 'citrico', 1) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('bergamota', (select id from public.notes where slug = 'bergamota')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('betula', 'Bétula', 'Birch') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'betula'), 'amadeirado', 0.7) on conflict do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'betula'), 'ambarado', 0.3) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('betula', (select id from public.notes where slug = 'betula')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('broto-de-cassis', 'Broto de cassis', 'Blackcurrant Bud') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'broto-de-cassis'), 'frutado', 0.6) on conflict do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'broto-de-cassis'), 'verde', 0.4) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('broto de cassis', (select id from public.notes where slug = 'broto-de-cassis')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('butterscotch', 'Butterscotch', 'Butterscotch') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'butterscotch'), 'doce', 1) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('butterscotch', (select id from public.notes where slug = 'butterscotch')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('cacau', 'Cacau', 'Cocoa') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'cacau'), 'doce', 0.8) on conflict do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'cacau'), 'amadeirado', 0.2) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('cacau', (select id from public.notes where slug = 'cacau')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('cade', 'Cade', 'Cade') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'cade'), 'amadeirado', 0.7) on conflict do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'cade'), 'ambarado', 0.3) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('cade', (select id from public.notes where slug = 'cade')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('cafe', 'Café', 'Coffee') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'cafe'), 'doce', 0.5) on conflict do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'cafe'), 'ambarado', 0.3) on conflict do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'cafe'), 'especiado', 0.2) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('cafe', (select id from public.notes where slug = 'cafe')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('cafe-arabica', 'Café arábica', 'Coffee Arabica') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'cafe-arabica'), 'doce', 0.5) on conflict do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'cafe-arabica'), 'ambarado', 0.3) on conflict do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'cafe-arabica'), 'especiado', 0.2) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('cafe arabica', (select id from public.notes where slug = 'cafe-arabica')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('calone', 'Calone', 'Calone') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'calone'), 'aromatico', 0.7) on conflict do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'calone'), 'frutado', 0.3) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('calone', (select id from public.notes where slug = 'calone')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('camurca', 'Camurça', 'Suede') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'camurca'), 'ambarado', 0.4) on conflict do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'camurca'), 'almiscarado', 0.6) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('camurca', (select id from public.notes where slug = 'camurca')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('canela', 'Canela', 'Cinnamon') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'canela'), 'especiado', 0.7) on conflict do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'canela'), 'doce', 0.3) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('canela', (select id from public.notes where slug = 'canela')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('caramelo', 'Caramelo', 'Caramel') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'caramelo'), 'doce', 1) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('caramelo', (select id from public.notes where slug = 'caramelo')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('cardamomo', 'Cardamomo', 'Cardamo') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'cardamomo'), 'especiado', 0.7) on conflict do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'cardamomo'), 'aromatico', 0.3) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('cardamomo', (select id from public.notes where slug = 'cardamomo')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('carvalho', 'Carvalho', 'Oak') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'carvalho'), 'amadeirado', 1) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('carvalho', (select id from public.notes where slug = 'carvalho')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('cashmeran', 'Cashmeran', 'Casherman') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'cashmeran'), 'amadeirado', 0.6) on conflict do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'cashmeran'), 'almiscarado', 0.4) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('cashmeran', (select id from public.notes where slug = 'cashmeran')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('cassis', 'Cassis', 'Black Currant') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'cassis'), 'frutado', 0.8) on conflict do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'cassis'), 'verde', 0.2) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('cassis', (select id from public.notes where slug = 'cassis')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('castoreo', 'Castóreo', 'Castoreum') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'castoreo'), 'ambarado', 0.5) on conflict do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'castoreo'), 'almiscarado', 0.5) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('castoreo', (select id from public.notes where slug = 'castoreo')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('cedro', 'Cedro', 'Cedar') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'cedro'), 'amadeirado', 1) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('cedro', (select id from public.notes where slug = 'cedro')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('cereja', 'Cereja', 'Cherry') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'cereja'), 'frutado', 0.8) on conflict do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'cereja'), 'doce', 0.2) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('cereja', (select id from public.notes where slug = 'cereja')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('cereja-negra', 'Cereja-negra', 'Black Cherry') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'cereja-negra'), 'frutado', 0.7) on conflict do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'cereja-negra'), 'doce', 0.3) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('cereja-negra', (select id from public.notes where slug = 'cereja-negra')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('cha', 'Chá', 'Tea') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'cha'), 'aromatico', 0.5) on conflict do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'cha'), 'verde', 0.5) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('cha', (select id from public.notes where slug = 'cha')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('cha-preto', 'Chá preto', 'Black Tea') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'cha-preto'), 'aromatico', 0.5) on conflict do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'cha-preto'), 'amadeirado', 0.3) on conflict do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'cha-preto'), 'doce', 0.2) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('cha preto', (select id from public.notes where slug = 'cha-preto')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('cha-verde', 'Chá verde', 'Green Tea') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'cha-verde'), 'verde', 0.6) on conflict do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'cha-verde'), 'aromatico', 0.4) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('cha verde', (select id from public.notes where slug = 'cha-verde')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('chiclete', 'Chiclete', 'Bubble Gum') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'chiclete'), 'doce', 0.7) on conflict do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'chiclete'), 'frutado', 0.3) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('chiclete', (select id from public.notes where slug = 'chiclete')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('chocolate', 'Chocolate', 'Chocolate') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'chocolate'), 'doce', 1) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('chocolate', (select id from public.notes where slug = 'chocolate')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('cidra', 'Cidra', 'Citron') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'cidra'), 'citrico', 1) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('cidra', (select id from public.notes where slug = 'cidra')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('cipreste', 'Cipreste', 'Cypress') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'cipreste'), 'amadeirado', 0.7) on conflict do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'cipreste'), 'verde', 0.3) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('cipreste', (select id from public.notes where slug = 'cipreste')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('civeta', 'Civeta', 'Civet') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'civeta'), 'almiscarado', 0.6) on conflict do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'civeta'), 'ambarado', 0.4) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('civeta', (select id from public.notes where slug = 'civeta')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('coco', 'Coco', 'Coconut') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'coco'), 'frutado', 0.5) on conflict do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'coco'), 'doce', 0.5) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('coco', (select id from public.notes where slug = 'coco')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('coentro', 'Coentro', 'Coriander') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'coentro'), 'especiado', 0.6) on conflict do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'coentro'), 'aromatico', 0.4) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('coentro', (select id from public.notes where slug = 'coentro')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('cominho', 'Cominho', 'Cumin') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'cominho'), 'especiado', 1) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('cominho', (select id from public.notes where slug = 'cominho')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('conhaque', 'Conhaque', 'Cognac') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'conhaque'), 'ambarado', 0.5) on conflict do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'conhaque'), 'doce', 0.3) on conflict do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'conhaque'), 'frutado', 0.2) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('conhaque', (select id from public.notes where slug = 'conhaque')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('couro', 'Couro', 'Leather') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'couro'), 'ambarado', 0.5) on conflict do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'couro'), 'amadeirado', 0.5) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('couro', (select id from public.notes where slug = 'couro')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('cravo-flor', 'Cravo (flor)', 'Carnation') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'cravo-flor'), 'floral', 0.6) on conflict do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'cravo-flor'), 'especiado', 0.4) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('cravo (flor)', (select id from public.notes where slug = 'cravo-flor')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('cravo-da-india', 'Cravo-da-índia', 'Clove') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'cravo-da-india'), 'especiado', 1) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('cravo-da-india', (select id from public.notes where slug = 'cravo-da-india')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('creme', 'Creme', 'Cream') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'creme'), 'doce', 0.7) on conflict do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'creme'), 'almiscarado', 0.3) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('creme', (select id from public.notes where slug = 'creme')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('cypriol', 'Cypriol', 'Cypriol') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'cypriol'), 'amadeirado', 0.8) on conflict do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'cypriol'), 'especiado', 0.2) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('cypriol', (select id from public.notes where slug = 'cypriol')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('damasco', 'Damasco', 'Apricot') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'damasco'), 'frutado', 1) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('damasco', (select id from public.notes where slug = 'damasco')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('davana', 'Davana', 'Davana') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'davana'), 'frutado', 0.5) on conflict do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'davana'), 'ambarado', 0.3) on conflict do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'davana'), 'aromatico', 0.2) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('davana', (select id from public.notes where slug = 'davana')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('elemi', 'Elemi', 'Elemi') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'elemi'), 'especiado', 0.5) on conflict do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'elemi'), 'citrico', 0.3) on conflict do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'elemi'), 'ambarado', 0.2) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('elemi', (select id from public.notes where slug = 'elemi')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('especiarias', 'Especiarias', 'Spices') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'especiarias'), 'especiado', 1) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('especiarias', (select id from public.notes where slug = 'especiarias')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('essencia-de-neroli', 'Essência de neroli', null) on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'essencia-de-neroli'), 'floral', 0.6) on conflict do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'essencia-de-neroli'), 'citrico', 0.4) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('essencia de neroli', (select id from public.notes where slug = 'essencia-de-neroli')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('estoraque', 'Estoraque', 'Styrax') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'estoraque'), 'ambarado', 1) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('estoraque', (select id from public.notes where slug = 'estoraque')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('fava-tonka', 'Fava-tonka', 'Tonka') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'fava-tonka'), 'doce', 0.7) on conflict do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'fava-tonka'), 'ambarado', 0.3) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('fava-tonka', (select id from public.notes where slug = 'fava-tonka')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('figo', 'Figo', 'Fig') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'figo'), 'frutado', 0.5) on conflict do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'figo'), 'verde', 0.3) on conflict do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'figo'), 'amadeirado', 0.2) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('figo', (select id from public.notes where slug = 'figo')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('flor-de-laranjeira', 'Flor de laranjeira', 'Orange Blossom') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'flor-de-laranjeira'), 'floral', 1) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('flor de laranjeira', (select id from public.notes where slug = 'flor-de-laranjeira')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('flores-brancas', 'Flores brancas', 'White Flowers') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'flores-brancas'), 'floral', 1) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('flores brancas', (select id from public.notes where slug = 'flores-brancas')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('folha-de-tabaco', 'Folha de tabaco', 'Tobacco Leaf') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'folha-de-tabaco'), 'ambarado', 0.5) on conflict do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'folha-de-tabaco'), 'doce', 0.3) on conflict do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'folha-de-tabaco'), 'amadeirado', 0.2) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('folha de tabaco', (select id from public.notes where slug = 'folha-de-tabaco')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('folha-de-tomate', 'Folha de tomate', 'Tomato Leaf') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'folha-de-tomate'), 'verde', 1) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('folha de tomate', (select id from public.notes where slug = 'folha-de-tomate')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('folha-de-violeta', 'Folha de violeta', 'Violet Leaf') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'folha-de-violeta'), 'verde', 0.8) on conflict do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'folha-de-violeta'), 'floral', 0.2) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('folha de violeta', (select id from public.notes where slug = 'folha-de-violeta')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('framboesa', 'Framboesa', 'Raspberry') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'framboesa'), 'frutado', 1) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('framboesa', (select id from public.notes where slug = 'framboesa')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('fresia', 'Frésia', 'Freesia') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'fresia'), 'floral', 1) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('fresia', (select id from public.notes where slug = 'fresia')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('frutas-vermelhas', 'Frutas vermelhas', 'Berries') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'frutas-vermelhas'), 'frutado', 1) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('frutas vermelhas', (select id from public.notes where slug = 'frutas-vermelhas')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('fumaca', 'Fumaça', 'Smoke') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'fumaca'), 'amadeirado', 0.6) on conflict do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'fumaca'), 'ambarado', 0.4) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('fumaca', (select id from public.notes where slug = 'fumaca')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('galbano', 'galbano', 'Galbanum') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'galbano'), 'verde', 1) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('galbano', (select id from public.notes where slug = 'galbano')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('gardenia', 'Gardênia', 'Gardenia') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'gardenia'), 'floral', 1) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('gardenia', (select id from public.notes where slug = 'gardenia')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('gengibre', 'Gengibre', 'Ginger') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'gengibre'), 'especiado', 0.7) on conflict do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'gengibre'), 'citrico', 0.3) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('gengibre', (select id from public.notes where slug = 'gengibre')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('geranio', 'Gerânio', 'Geranium') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'geranio'), 'floral', 0.5) on conflict do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'geranio'), 'verde', 0.3) on conflict do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'geranio'), 'aromatico', 0.2) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('geranio', (select id from public.notes where slug = 'geranio')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('grama', 'Grama', 'Grass') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'grama'), 'verde', 1) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('grama', (select id from public.notes where slug = 'grama')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('guaiaco', 'Guaiaco', 'Guaiac Wood') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'guaiaco'), 'amadeirado', 0.8) on conflict do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'guaiaco'), 'ambarado', 0.2) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('guaiaco', (select id from public.notes where slug = 'guaiaco')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('hedione', 'Hedione', 'Hedione') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'hedione'), 'floral', 1) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('hedione', (select id from public.notes where slug = 'hedione')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('heliotropio', 'Heliotrópio', 'Heliotrope') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'heliotropio'), 'floral', 0.6) on conflict do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'heliotropio'), 'doce', 0.4) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('heliotropio', (select id from public.notes where slug = 'heliotropio')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('hortela', 'Hortelã', 'Spearmint') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'hortela'), 'aromatico', 1) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('hortela', (select id from public.notes where slug = 'hortela')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('hortela-pimenta', 'Hortelã-pimenta', 'Peppermint') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'hortela-pimenta'), 'aromatico', 1) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('hortela-pimenta', (select id from public.notes where slug = 'hortela-pimenta')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('incenso', 'Incenso', 'Incense') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'incenso'), 'ambarado', 0.7) on conflict do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'incenso'), 'amadeirado', 0.3) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('incenso', (select id from public.notes where slug = 'incenso')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('iris', 'Íris', 'Iris') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'iris'), 'floral', 0.7) on conflict do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'iris'), 'almiscarado', 0.3) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('iris', (select id from public.notes where slug = 'iris')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('iso-e-super', 'Iso E Super', 'Iso E Super') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'iso-e-super'), 'amadeirado', 1) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('iso e super', (select id from public.notes where slug = 'iso-e-super')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('jasmim', 'Jasmim', 'Jasmine') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'jasmim'), 'floral', 1) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('jasmim', (select id from public.notes where slug = 'jasmim')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('jasmim-marroquino', 'Jasmim marroquino', 'Moroccan Jasmine') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'jasmim-marroquino'), 'floral', 1) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('jasmim marroquino', (select id from public.notes where slug = 'jasmim-marroquino')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('jasmim-sambac', 'Jasmim sambac', 'Jasmine Sambac') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'jasmim-sambac'), 'floral', 1) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('jasmim sambac', (select id from public.notes where slug = 'jasmim-sambac')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('kumquat', 'Kumquat', 'Kumquat') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'kumquat'), 'citrico', 0.8) on conflict do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'kumquat'), 'frutado', 0.3) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('kumquat', (select id from public.notes where slug = 'kumquat')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('ladano', 'Ládano', 'Cistus Labdanum') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'ladano'), 'ambarado', 1) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('ladano', (select id from public.notes where slug = 'ladano')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('laranja', 'Laranja', 'Orange') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'laranja'), 'citrico', 1) on conflict do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'laranja'), 'frutado', 0.2) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('laranja', (select id from public.notes where slug = 'laranja')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('laranja-amarga', 'Laranja amarga', 'Bitter Orange') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'laranja-amarga'), 'citrico', 1) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('laranja amarga', (select id from public.notes where slug = 'laranja-amarga')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('laranja-sanguinea', 'Laranja sanguínea', 'Blood Orange') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'laranja-sanguinea'), 'citrico', 0.8) on conflict do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'laranja-sanguinea'), 'frutado', 0.3) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('laranja sanguinea', (select id from public.notes where slug = 'laranja-sanguinea')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('lavanda', 'Lavanda', 'Lavander') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'lavanda'), 'aromatico', 0.8) on conflict do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'lavanda'), 'floral', 0.2) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('lavanda', (select id from public.notes where slug = 'lavanda')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('leite', 'Leite', 'Milk') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'leite'), 'doce', 0.7) on conflict do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'leite'), 'almiscarado', 0.3) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('leite', (select id from public.notes where slug = 'leite')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('lichia', 'Lichia', 'Litchi') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'lichia'), 'frutado', 0.8) on conflict do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'lichia'), 'floral', 0.2) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('lichia', (select id from public.notes where slug = 'lichia')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('limao', 'Limão', 'Lime') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'limao'), 'citrico', 1) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('limao', (select id from public.notes where slug = 'limao')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('limao-siciliano', 'Limão-siciliano', 'Lemon') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'limao-siciliano'), 'citrico', 1) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('limao-siciliano', (select id from public.notes where slug = 'limao-siciliano')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('lirio', 'Lírio', 'Lily') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'lirio'), 'floral', 1) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('lirio', (select id from public.notes where slug = 'lirio')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('lirio-do-vale', 'Lírio-do-vale', 'Lily Of The Valley') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'lirio-do-vale'), 'floral', 0.8) on conflict do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'lirio-do-vale'), 'verde', 0.2) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('lirio-do-vale', (select id from public.notes where slug = 'lirio-do-vale')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('lotus', 'Lótus', 'Lotus') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'lotus'), 'floral', 1) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('lotus', (select id from public.notes where slug = 'lotus')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('maca', 'Maçã', 'Apple') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'maca'), 'frutado', 1) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('maca', (select id from public.notes where slug = 'maca')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('maca-verde', 'Maçã verde', 'Green Apple') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'maca-verde'), 'frutado', 0.8) on conflict do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'maca-verde'), 'verde', 0.2) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('maca verde', (select id from public.notes where slug = 'maca-verde')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('madeira-de-cashmere', 'Madeira de cashmere', 'Cashmere') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'madeira-de-cashmere'), 'amadeirado', 0.6) on conflict do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'madeira-de-cashmere'), 'almiscarado', 0.4) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('madeira de cashmere', (select id from public.notes where slug = 'madeira-de-cashmere')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('madressilva', 'Madressilva', 'Honeysuckle') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'madressilva'), 'floral', 1) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('madressilva', (select id from public.notes where slug = 'madressilva')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('magnolia', 'Magnólia', 'Magnolia') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'magnolia'), 'floral', 1) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('magnolia', (select id from public.notes where slug = 'magnolia')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('manga', 'Manga', 'Mango') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'manga'), 'frutado', 1) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('manga', (select id from public.notes where slug = 'manga')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('manjericao', 'Manjericão', 'Basil') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'manjericao'), 'aromatico', 0.8) on conflict do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'manjericao'), 'verde', 0.2) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('manjericao', (select id from public.notes where slug = 'manjericao')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('manteiga', 'Manteiga', 'Butter') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'manteiga'), 'doce', 1) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('manteiga', (select id from public.notes where slug = 'manteiga')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('maracuja', 'Maracujá', 'Passion Fruit') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'maracuja'), 'frutado', 1) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('maracuja', (select id from public.notes where slug = 'maracuja')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('marshmallow', 'Marshmallow', 'Marshmallow') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'marshmallow'), 'doce', 1) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('marshmallow', (select id from public.notes where slug = 'marshmallow')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('mel', 'Mel', 'Honey') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'mel'), 'doce', 0.8) on conflict do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'mel'), 'ambarado', 0.2) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('mel', (select id from public.notes where slug = 'mel')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('melancia', 'Melancia', 'Watermelon') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'melancia'), 'frutado', 1) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('melancia', (select id from public.notes where slug = 'melancia')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('melao', 'Melão', 'Melon') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'melao'), 'frutado', 1) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('melao', (select id from public.notes where slug = 'melao')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('menta', 'Menta', 'Mint') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'menta'), 'aromatico', 1) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('menta', (select id from public.notes where slug = 'menta')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('mimosa', 'Mimosa', 'Mimosa') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'mimosa'), 'floral', 0.7) on conflict do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'mimosa'), 'doce', 0.3) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('mimosa', (select id from public.notes where slug = 'mimosa')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('mirra', 'Mirra', 'Myrh') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'mirra'), 'ambarado', 0.8) on conflict do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'mirra'), 'especiado', 0.2) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('mirra', (select id from public.notes where slug = 'mirra')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('morango', 'Morango', 'Strawberry') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'morango'), 'frutado', 0.8) on conflict do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'morango'), 'doce', 0.2) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('morango', (select id from public.notes where slug = 'morango')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('musgo', 'Musgo', 'Moss') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'musgo'), 'verde', 0.6) on conflict do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'musgo'), 'amadeirado', 0.4) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('musgo', (select id from public.notes where slug = 'musgo')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('musgo-de-carvalho', 'Musgo de carvalho', 'Oakmoss') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'musgo-de-carvalho'), 'verde', 0.5) on conflict do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'musgo-de-carvalho'), 'amadeirado', 0.5) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('musgo de carvalho', (select id from public.notes where slug = 'musgo-de-carvalho')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('neroli', 'Neroli', 'Neroli') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'neroli'), 'floral', 0.6) on conflict do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'neroli'), 'citrico', 0.4) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('neroli', (select id from public.notes where slug = 'neroli')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('notas-amadeiradas', 'Notas amadeiradas', 'Woods') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'notas-amadeiradas'), 'amadeirado', 1) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('notas amadeiradas', (select id from public.notes where slug = 'notas-amadeiradas')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('notas-aquaticas', 'Notas aquáticas', 'Aquatic Notes') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'notas-aquaticas'), 'verde', 0.3) on conflict do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'notas-aquaticas'), 'aromatico', 0.7) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('notas aquaticas', (select id from public.notes where slug = 'notas-aquaticas')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('notas-atalcadas', 'Notas atalcadas', 'Powdery Notes') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'notas-atalcadas'), 'almiscarado', 0.7) on conflict do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'notas-atalcadas'), 'floral', 0.3) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('notas atalcadas', (select id from public.notes where slug = 'notas-atalcadas')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('notas-balsamicas', 'Notas balsâmicas', 'Balsamic Notes') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'notas-balsamicas'), 'ambarado', 0.7) on conflict do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'notas-balsamicas'), 'doce', 0.3) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('notas balsamicas', (select id from public.notes where slug = 'notas-balsamicas')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('notas-cremosas', 'Notas cremosas', 'Creamy') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'notas-cremosas'), 'doce', 0.6) on conflict do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'notas-cremosas'), 'almiscarado', 0.4) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('notas cremosas', (select id from public.notes where slug = 'notas-cremosas')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('notas-defumadas', 'Notas defumadas', 'Smoky') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'notas-defumadas'), 'amadeirado', 0.6) on conflict do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'notas-defumadas'), 'ambarado', 0.4) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('notas defumadas', (select id from public.notes where slug = 'notas-defumadas')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('notas-especiadas', 'Notas especiadas', 'Spicy Notes') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'notas-especiadas'), 'especiado', 1) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('notas especiadas', (select id from public.notes where slug = 'notas-especiadas')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('notas-florais', 'Notas florais', 'Floral') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'notas-florais'), 'floral', 1) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('notas florais', (select id from public.notes where slug = 'notas-florais')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('notas-frutadas', 'Notas frutadas', 'Fruity') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'notas-frutadas'), 'frutado', 1) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('notas frutadas', (select id from public.notes where slug = 'notas-frutadas')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('notas-gourmand', 'Notas gourmand', 'Gourmand') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'notas-gourmand'), 'doce', 1) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('notas gourmand', (select id from public.notes where slug = 'notas-gourmand')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('notas-herbais', 'Notas herbais', 'Herbal Notes') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'notas-herbais'), 'aromatico', 0.7) on conflict do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'notas-herbais'), 'verde', 0.3) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('notas herbais', (select id from public.notes where slug = 'notas-herbais')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('notas-marinhas', 'Notas marinhas', 'Marine') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'notas-marinhas'), 'verde', 0.3) on conflict do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'notas-marinhas'), 'aromatico', 0.7) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('notas marinhas', (select id from public.notes where slug = 'notas-marinhas')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('notas-ozonicas', 'Notas ozônicas', 'Ozonic') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'notas-ozonicas'), 'aromatico', 0.8) on conflict do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'notas-ozonicas'), 'verde', 0.2) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('notas ozonicas', (select id from public.notes where slug = 'notas-ozonicas')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('notas-verdes', 'Notas verdes', 'Green Notes') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'notas-verdes'), 'verde', 1) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('notas verdes', (select id from public.notes where slug = 'notas-verdes')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('noz-moscada', 'Noz-moscada', 'Nutemag') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'noz-moscada'), 'especiado', 1) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('noz-moscada', (select id from public.notes where slug = 'noz-moscada')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('olibano', 'Olíbano', 'Frankincense') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'olibano'), 'ambarado', 0.7) on conflict do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'olibano'), 'amadeirado', 0.3) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('olibano', (select id from public.notes where slug = 'olibano')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('opoponax', 'Opoponax', 'Opoponax') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'opoponax'), 'ambarado', 0.7) on conflict do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'opoponax'), 'doce', 0.3) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('opoponax', (select id from public.notes where slug = 'opoponax')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('orquidea', 'Orquídea', 'Orchid') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'orquidea'), 'floral', 1) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('orquidea', (select id from public.notes where slug = 'orquidea')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('osmanto', 'Osmanto', 'Osmanthus') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'osmanto'), 'floral', 0.7) on conflict do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'osmanto'), 'frutado', 0.3) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('osmanto', (select id from public.notes where slug = 'osmanto')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('oud', 'Oud', 'Agarwood') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'oud'), 'amadeirado', 0.8) on conflict do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'oud'), 'ambarado', 0.2) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('oud', (select id from public.notes where slug = 'oud')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('pao', 'Pão', 'Bread') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'pao'), 'doce', 1) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('pao', (select id from public.notes where slug = 'pao')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('patchouli', 'Patchouli', 'Patchouli') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'patchouli'), 'amadeirado', 0.8) on conflict do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'patchouli'), 'verde', 0.2) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('patchouli', (select id from public.notes where slug = 'patchouli')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('peonia', 'Peônia', 'Peony') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'peonia'), 'floral', 1) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('peonia', (select id from public.notes where slug = 'peonia')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('pepino', 'Pepino', 'Cucumber') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'pepino'), 'verde', 0.7) on conflict do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'pepino'), 'frutado', 0.3) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('pepino', (select id from public.notes where slug = 'pepino')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('pera', 'Pera', 'Pear') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'pera'), 'frutado', 1) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('pera', (select id from public.notes where slug = 'pera')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('pera-nashi', 'Pera nashi', 'Nashi Pear') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'pera-nashi'), 'frutado', 1) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('pera nashi', (select id from public.notes where slug = 'pera-nashi')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('pessego', 'Pêssego', 'Peach') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'pessego'), 'frutado', 1) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('pessego', (select id from public.notes where slug = 'pessego')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('petitgrain', 'Petitgrain', 'Petitgrain') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'petitgrain'), 'citrico', 0.6) on conflict do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'petitgrain'), 'verde', 0.3) on conflict do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'petitgrain'), 'aromatico', 0.2) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('petitgrain', (select id from public.notes where slug = 'petitgrain')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('pimenta', 'Pimenta', 'Pepper') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'pimenta'), 'especiado', 1) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('pimenta', (select id from public.notes where slug = 'pimenta')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('pimenta-de-sichuan', 'Pimenta de Sichuan', 'Sichuan Pepper') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'pimenta-de-sichuan'), 'especiado', 0.7) on conflict do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'pimenta-de-sichuan'), 'citrico', 0.3) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('pimenta de sichuan', (select id from public.notes where slug = 'pimenta-de-sichuan')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('pimenta-branca', 'Pimenta-branca', 'White Pepper') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'pimenta-branca'), 'especiado', 1) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('pimenta-branca', (select id from public.notes where slug = 'pimenta-branca')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('pimenta-da-jamaica', 'Pimenta-da-jamaica', 'Pimento') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'pimenta-da-jamaica'), 'especiado', 1) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('pimenta-da-jamaica', (select id from public.notes where slug = 'pimenta-da-jamaica')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('pimenta-preta', 'Pimenta-preta', 'Black Pepper') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'pimenta-preta'), 'especiado', 1) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('pimenta-preta', (select id from public.notes where slug = 'pimenta-preta')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('pimenta-rosa', 'Pimenta-rosa', 'Pink Pepper') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'pimenta-rosa'), 'especiado', 1) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('pimenta-rosa', (select id from public.notes where slug = 'pimenta-rosa')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('pinho', 'Pinho', 'Pine') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'pinho'), 'amadeirado', 0.6) on conflict do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'pinho'), 'verde', 0.4) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('pinho', (select id from public.notes where slug = 'pinho')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('pistache', 'Pistache', 'Pistachio') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'pistache'), 'doce', 1) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('pistache', (select id from public.notes where slug = 'pistache')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('praline', 'Praliné', 'Praline') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'praline'), 'doce', 1) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('praline', (select id from public.notes where slug = 'praline')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('resinas', 'Resinas', 'Resins') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'resinas'), 'ambarado', 1) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('resinas', (select id from public.notes where slug = 'resinas')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('roma', 'Romã', 'Pomegranate') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'roma'), 'frutado', 1) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('roma', (select id from public.notes where slug = 'roma')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('rosa', 'Rosa', 'Rose') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'rosa'), 'floral', 1) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('rosa', (select id from public.notes where slug = 'rosa')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('rosa-bulgara', 'Rosa búlgara', 'Bulgarian Rose') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'rosa-bulgara'), 'floral', 1) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('rosa bulgara', (select id from public.notes where slug = 'rosa-bulgara')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('rosa-centifolia', 'Rosa centifólia', 'Rose Centifolia') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'rosa-centifolia'), 'floral', 1) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('rosa centifolia', (select id from public.notes where slug = 'rosa-centifolia')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('rosa-damascena', 'Rosa damascena', 'Damask Rose') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'rosa-damascena'), 'floral', 1) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('rosa damascena', (select id from public.notes where slug = 'rosa-damascena')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('rosa-de-taif', 'Rosa de Taif', 'Taif Rose') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'rosa-de-taif'), 'floral', 1) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('rosa de taif', (select id from public.notes where slug = 'rosa-de-taif')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('rosa-turca', 'Rosa turca', 'Turkish Rose') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'rosa-turca'), 'floral', 1) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('rosa turca', (select id from public.notes where slug = 'rosa-turca')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('ruibarbo', 'Ruibarbo', 'Rhubarb') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'ruibarbo'), 'frutado', 0.6) on conflict do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'ruibarbo'), 'verde', 0.4) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('ruibarbo', (select id from public.notes where slug = 'ruibarbo')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('rum', 'Rum', 'Rum') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'rum'), 'doce', 0.6) on conflict do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'rum'), 'ambarado', 0.4) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('rum', (select id from public.notes where slug = 'rum')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('sal', 'Sal', 'Salt') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'sal'), 'aromatico', 0.5) on conflict do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'sal'), 'almiscarado', 0.5) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('sal', (select id from public.notes where slug = 'sal')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('sal-marinho', 'Sal marinho', 'Sea Salt') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'sal-marinho'), 'aromatico', 0.5) on conflict do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'sal-marinho'), 'almiscarado', 0.5) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('sal marinho', (select id from public.notes where slug = 'sal-marinho')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('salvia', 'Sálvia', 'Sage') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'salvia'), 'aromatico', 1) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('salvia', (select id from public.notes where slug = 'salvia')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('salvia-esclareia', 'Sálvia-esclareia', 'Clary Sage') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'salvia-esclareia'), 'aromatico', 0.8) on conflict do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'salvia-esclareia'), 'almiscarado', 0.2) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('salvia-esclareia', (select id from public.notes where slug = 'salvia-esclareia')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('sandalo', 'Sândalo', 'Sandal Wood') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'sandalo'), 'amadeirado', 0.8) on conflict do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'sandalo'), 'almiscarado', 0.2) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('sandalo', (select id from public.notes where slug = 'sandalo')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('serenolide', 'Serenolide™', null) on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'serenolide'), 'almiscarado', 1) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('serenolide', (select id from public.notes where slug = 'serenolide')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('tabaco', 'Tabaco', 'Tobacco') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'tabaco'), 'ambarado', 0.5) on conflict do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'tabaco'), 'doce', 0.3) on conflict do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'tabaco'), 'amadeirado', 0.2) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('tabaco', (select id from public.notes where slug = 'tabaco')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('tamara', 'Tâmara', 'Date') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'tamara'), 'frutado', 0.5) on conflict do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'tamara'), 'doce', 0.5) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('tamara', (select id from public.notes where slug = 'tamara')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('tangerina', 'Tangerina', 'Mandarin') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'tangerina'), 'citrico', 1) on conflict do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'tangerina'), 'frutado', 0.3) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('tangerina', (select id from public.notes where slug = 'tangerina')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('toffee', 'Toffee', 'Toffee') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'toffee'), 'doce', 1) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('toffee', (select id from public.notes where slug = 'toffee')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('tomilho', 'Tomilho', 'Thyme') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'tomilho'), 'aromatico', 1) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('tomilho', (select id from public.notes where slug = 'tomilho')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('toranja', 'Toranja', 'Grapefruit') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'toranja'), 'citrico', 1) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('toranja', (select id from public.notes where slug = 'toranja')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('toranja-rosa', 'Toranja rosa', 'Pink Grapefruit') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'toranja-rosa'), 'citrico', 0.9) on conflict do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'toranja-rosa'), 'frutado', 0.2) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('toranja rosa', (select id from public.notes where slug = 'toranja-rosa')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('tuberosa', 'Tuberosa', 'Tuberose') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'tuberosa'), 'floral', 1) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('tuberosa', (select id from public.notes where slug = 'tuberosa')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('uisque', 'Uísque', 'Whiskey') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'uisque'), 'ambarado', 0.6) on conflict do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'uisque'), 'amadeirado', 0.4) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('uisque', (select id from public.notes where slug = 'uisque')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('uva', 'Uva', 'Grape') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'uva'), 'frutado', 1) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('uva', (select id from public.notes where slug = 'uva')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('vetiver', 'Vetiver', 'Vetiver') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'vetiver'), 'amadeirado', 0.7) on conflict do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'vetiver'), 'verde', 0.3) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('vetiver', (select id from public.notes where slug = 'vetiver')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('violeta', 'Violeta', 'Violet') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'violeta'), 'floral', 1) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('violeta', (select id from public.notes where slug = 'violeta')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('ylang-ylang', 'Ylang-ylang', 'Ylang Ylang') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'ylang-ylang'), 'floral', 1) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('ylang-ylang', (select id from public.notes where slug = 'ylang-ylang')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('yuzu', 'Yuzu', 'Yuzu') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'yuzu'), 'citrico', 1) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('yuzu', (select id from public.notes where slug = 'yuzu')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('zimbro', 'Zimbro', 'Juniper') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'zimbro'), 'aromatico', 0.6) on conflict do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'zimbro'), 'amadeirado', 0.2) on conflict do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'zimbro'), 'citrico', 0.2) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('zimbro', (select id from public.notes where slug = 'zimbro')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('acucar-mascavo', 'Açúcar mascavo', 'Brown Sugar') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'acucar-mascavo'), 'doce', 1) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('acucar mascavo', (select id from public.notes where slug = 'acucar-mascavo')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('akigalawood', 'Akigalawood', 'Akigalawood') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'akigalawood'), 'amadeirado', 0.7) on conflict do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'akigalawood'), 'especiado', 0.3) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('akigalawood', (select id from public.notes where slug = 'akigalawood')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('alcacuz', 'Alcaçuz', 'Liquorice') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'alcacuz'), 'doce', 0.6) on conflict do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'alcacuz'), 'especiado', 0.4) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('alcacuz', (select id from public.notes where slug = 'alcacuz')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('amberxtreme', 'Amberxtreme', 'Amberxtreme') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'amberxtreme'), 'ambarado', 0.7) on conflict do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'amberxtreme'), 'amadeirado', 0.3) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('amberxtreme', (select id from public.notes where slug = 'amberxtreme')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('balsamo-de-gurjum', 'Bálsamo de gurjum', 'Gurjum') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'balsamo-de-gurjum'), 'amadeirado', 0.5) on conflict do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'balsamo-de-gurjum'), 'ambarado', 0.5) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('balsamo de gurjum', (select id from public.notes where slug = 'balsamo-de-gurjum')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('balsamo-do-peru', 'Bálsamo-do-peru', 'Peru Balsam') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'balsamo-do-peru'), 'ambarado', 0.7) on conflict do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'balsamo-do-peru'), 'doce', 0.3) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('balsamo-do-peru', (select id from public.notes where slug = 'balsamo-do-peru')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('camelia', 'Camélia', 'Camelia') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'camelia'), 'floral', 1) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('camelia', (select id from public.notes where slug = 'camelia')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('castanha', 'Castanha', 'Chestnut') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'castanha'), 'doce', 0.6) on conflict do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'castanha'), 'amadeirado', 0.4) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('castanha', (select id from public.notes where slug = 'castanha')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('champanhe', 'Champanhe', 'Champagne') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'champanhe'), 'frutado', 0.5) on conflict do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'champanhe'), 'citrico', 0.3) on conflict do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'champanhe'), 'doce', 0.2) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('champanhe', (select id from public.notes where slug = 'champanhe')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('ciclame', 'Cíclame', 'Cyclamen') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'ciclame'), 'floral', 0.8) on conflict do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'ciclame'), 'verde', 0.2) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('ciclame', (select id from public.notes where slug = 'ciclame')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('eucalipto', 'Eucalipto', 'Eucalyptus') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'eucalipto'), 'aromatico', 0.7) on conflict do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'eucalipto'), 'verde', 0.3) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('eucalipto', (select id from public.notes where slug = 'eucalipto')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('flor-de-ameixeira', 'Flor de ameixeira', 'Plum Blossom') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'flor-de-ameixeira'), 'floral', 0.8) on conflict do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'flor-de-ameixeira'), 'frutado', 0.2) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('flor de ameixeira', (select id from public.notes where slug = 'flor-de-ameixeira')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('flor-de-pereira', 'Flor de pereira', 'Pear Blossom') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'flor-de-pereira'), 'floral', 0.7) on conflict do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'flor-de-pereira'), 'frutado', 0.3) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('flor de pereira', (select id from public.notes where slug = 'flor-de-pereira')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('flor-de-pessegueiro', 'Flor de pessegueiro', 'Peach Blossom') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'flor-de-pessegueiro'), 'floral', 0.7) on conflict do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'flor-de-pessegueiro'), 'frutado', 0.3) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('flor de pessegueiro', (select id from public.notes where slug = 'flor-de-pessegueiro')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('flor-de-sabugueiro', 'Flor de sabugueiro', 'Elder Flower') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'flor-de-sabugueiro'), 'floral', 0.7) on conflict do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'flor-de-sabugueiro'), 'verde', 0.3) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('flor de sabugueiro', (select id from public.notes where slug = 'flor-de-sabugueiro')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('flor-de-tiare', 'Flor de tiaré', 'Tiare Blossoms') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'flor-de-tiare'), 'floral', 1) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('flor de tiare', (select id from public.notes where slug = 'flor-de-tiare')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('frangipani', 'Frangipani', 'Frangipani') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'frangipani'), 'floral', 1) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('frangipani', (select id from public.notes where slug = 'frangipani')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('georgywood', 'Georgywood', 'Georgywood') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'georgywood'), 'amadeirado', 1) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('georgywood', (select id from public.notes where slug = 'georgywood')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('goiaba', 'Goiaba', 'Guava') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'goiaba'), 'frutado', 1) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('goiaba', (select id from public.notes where slug = 'goiaba')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('groselha', 'Groselha', 'Redcurrant') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'groselha'), 'frutado', 1) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('groselha', (select id from public.notes where slug = 'groselha')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('hibisco', 'Hibisco', 'Hibiscus') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'hibisco'), 'floral', 0.8) on conflict do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'hibisco'), 'frutado', 0.2) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('hibisco', (select id from public.notes where slug = 'hibisco')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('jacinto', 'Jacinto', 'Hyacinth') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'jacinto'), 'floral', 0.7) on conflict do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'jacinto'), 'verde', 0.3) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('jacinto', (select id from public.notes where slug = 'jacinto')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('kiwi', 'Kiwi', 'Kiwi') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'kiwi'), 'frutado', 1) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('kiwi', (select id from public.notes where slug = 'kiwi')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('licor-de-cereja', 'Licor de cereja', 'Cherry Liqueur') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'licor-de-cereja'), 'frutado', 0.6) on conflict do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'licor-de-cereja'), 'doce', 0.4) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('licor de cereja', (select id from public.notes where slug = 'licor-de-cereja')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('lilas', 'Lilás', 'Lilac') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'lilas'), 'floral', 1) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('lilas', (select id from public.notes where slug = 'lilas')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('loukoum', 'Loukoum', 'Loukhoum') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'loukoum'), 'doce', 0.7) on conflict do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'loukoum'), 'floral', 0.3) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('loukoum', (select id from public.notes where slug = 'loukoum')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('louro', 'Louro', 'Bay Leaf') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'louro'), 'aromatico', 0.6) on conflict do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'louro'), 'especiado', 0.4) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('louro', (select id from public.notes where slug = 'louro')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('madeira-de-figueira', 'Madeira de figueira', 'Fig Tree Wood') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'madeira-de-figueira'), 'amadeirado', 0.6) on conflict do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'madeira-de-figueira'), 'verde', 0.4) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('madeira de figueira', (select id from public.notes where slug = 'madeira-de-figueira')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('madeira-de-teca', 'Madeira de teca', 'Teak Wood') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'madeira-de-teca'), 'amadeirado', 1) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('madeira de teca', (select id from public.notes where slug = 'madeira-de-teca')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('mahonia', 'Mahonia', 'Mahonia') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'mahonia'), 'floral', 0.7) on conflict do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'mahonia'), 'frutado', 0.3) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('mahonia', (select id from public.notes where slug = 'mahonia')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('mamao', 'Mamão', 'Papaya') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'mamao'), 'frutado', 1) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('mamao', (select id from public.notes where slug = 'mamao')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('melaco', 'Melaço', 'Molasses') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'melaco'), 'doce', 1) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('melaco', (select id from public.notes where slug = 'melaco')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('narciso', 'Narciso', 'Narcissus') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'narciso'), 'floral', 0.8) on conflict do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'narciso'), 'verde', 0.2) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('narciso', (select id from public.notes where slug = 'narciso')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('nectarina', 'Nectarina', 'Nectarine') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'nectarina'), 'frutado', 1) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('nectarina', (select id from public.notes where slug = 'nectarina')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('notas-aromaticas', 'Notas aromáticas', 'Aromatic') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'notas-aromaticas'), 'aromatico', 1) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('notas aromaticas', (select id from public.notes where slug = 'notas-aromaticas')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('notas-citricas', 'Notas cítricas', 'Citrus') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'notas-citricas'), 'citrico', 1) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('notas citricas', (select id from public.notes where slug = 'notas-citricas')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('notas-doces', 'Notas doces', 'Sugary') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'notas-doces'), 'doce', 1) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('notas doces', (select id from public.notes where slug = 'notas-doces')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('notas-frescas', 'Notas frescas', 'Fresh') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'notas-frescas'), 'citrico', 0.5) on conflict do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'notas-frescas'), 'aromatico', 0.3) on conflict do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'notas-frescas'), 'verde', 0.2) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('notas frescas', (select id from public.notes where slug = 'notas-frescas')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('notas-licorosas', 'Notas licorosas', 'Liquorous') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'notas-licorosas'), 'doce', 0.5) on conflict do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'notas-licorosas'), 'frutado', 0.3) on conflict do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'notas-licorosas'), 'ambarado', 0.2) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('notas licorosas', (select id from public.notes where slug = 'notas-licorosas')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('nozes', 'Nozes', 'Nut') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'nozes'), 'doce', 0.5) on conflict do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'nozes'), 'amadeirado', 0.5) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('nozes', (select id from public.notes where slug = 'nozes')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('oregano', 'Orégano', 'Oregano') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'oregano'), 'aromatico', 0.6) on conflict do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'oregano'), 'especiado', 0.4) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('oregano', (select id from public.notes where slug = 'oregano')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('palo-santo', 'Palo santo', 'Palo Santo') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'palo-santo'), 'amadeirado', 0.7) on conflict do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'palo-santo'), 'ambarado', 0.3) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('palo santo', (select id from public.notes where slug = 'palo-santo')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('pau-rosa', 'Pau-rosa', 'Brazilian Rosewood') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'pau-rosa'), 'amadeirado', 0.6) on conflict do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'pau-rosa'), 'floral', 0.4) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('pau-rosa', (select id from public.notes where slug = 'pau-rosa')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('pederneira', 'Pederneira', 'Flint') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'pederneira'), 'amadeirado', 0.5) on conflict do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'pederneira'), 'aromatico', 0.5) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('pederneira', (select id from public.notes where slug = 'pederneira')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('petalia', 'Petalia', 'Petalia') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'petalia'), 'floral', 1) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('petalia', (select id from public.notes where slug = 'petalia')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('pipoca', 'Pipoca', 'Pop Corn') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'pipoca'), 'doce', 0.7) on conflict do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'pipoca'), 'amadeirado', 0.3) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('pipoca', (select id from public.notes where slug = 'pipoca')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('pitaia', 'Pitaia', 'Dragon Fruit') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'pitaia'), 'frutado', 1) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('pitaia', (select id from public.notes where slug = 'pitaia')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('rosyfolia', 'Rosyfolia', 'Rosyfolia') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'rosyfolia'), 'floral', 1) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('rosyfolia', (select id from public.notes where slug = 'rosyfolia')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('verbena', 'Verbena', 'Verbena') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'verbena'), 'citrico', 0.6) on conflict do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'verbena'), 'verde', 0.4) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('verbena', (select id from public.notes where slug = 'verbena')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('flor-de-amendoeira', 'Flor de amendoeira', 'Almond Blossom') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'flor-de-amendoeira'), 'floral', 0.7) on conflict do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'flor-de-amendoeira'), 'doce', 0.3) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('flor de amendoeira', (select id from public.notes where slug = 'flor-de-amendoeira')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('amyris', 'Amyris', 'Amyris') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'amyris'), 'amadeirado', 1) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('amyris', (select id from public.notes where slug = 'amyris')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('angelica', 'Angélica', 'Angelica') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'angelica'), 'aromatico', 0.6) on conflict do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'angelica'), 'verde', 0.4) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('angelica', (select id from public.notes where slug = 'angelica')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('flor-de-bananeira', 'Flor de bananeira', 'Banana Blossom') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'flor-de-bananeira'), 'floral', 0.6) on conflict do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'flor-de-bananeira'), 'frutado', 0.4) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('flor de bananeira', (select id from public.notes where slug = 'flor-de-bananeira')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('cera-de-abelha', 'Cera de abelha', 'Beeswax') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'cera-de-abelha'), 'doce', 0.5) on conflict do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'cera-de-abelha'), 'ambarado', 0.5) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('cera de abelha', (select id from public.notes where slug = 'cera-de-abelha')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('canfora', 'Cânfora', 'Camphorwood') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'canfora'), 'aromatico', 0.6) on conflict do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'canfora'), 'amadeirado', 0.4) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('canfora', (select id from public.notes where slug = 'canfora')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('cola', 'Cola', 'Cola') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'cola'), 'doce', 0.5) on conflict do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'cola'), 'especiado', 0.3) on conflict do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'cola'), 'citrico', 0.2) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('cola', (select id from public.notes where slug = 'cola')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('cumarina', 'Cumarina', 'Coumarin') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'cumarina'), 'doce', 0.6) on conflict do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'cumarina'), 'ambarado', 0.4) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('cumarina', (select id from public.notes where slug = 'cumarina')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('giesta', 'Giesta', 'Cytisus Scoparius') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'giesta'), 'floral', 0.7) on conflict do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'giesta'), 'verde', 0.3) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('giesta', (select id from public.notes where slug = 'giesta')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('duriao', 'Durião', 'Durian') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'duriao'), 'frutado', 1) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('duriao', (select id from public.notes where slug = 'duriao')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('flor-de-toranja', 'Flor de toranja', 'Grapefruit Blossom') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'flor-de-toranja'), 'floral', 0.6) on conflict do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'flor-de-toranja'), 'citrico', 0.4) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('flor de toranja', (select id from public.notes where slug = 'flor-de-toranja')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('horchata', 'Horchata', 'Horchata') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'horchata'), 'doce', 0.7) on conflict do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'horchata'), 'especiado', 0.3) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('horchata', (select id from public.notes where slug = 'horchata')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('imortela', 'Imortela', 'Immortelle') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'imortela'), 'ambarado', 0.5) on conflict do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'imortela'), 'doce', 0.3) on conflict do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'imortela'), 'aromatico', 0.2) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('imortela', (select id from public.notes where slug = 'imortela')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('litsea', 'Litsea', 'Litsea Cubeba') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'litsea'), 'citrico', 1) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('litsea', (select id from public.notes where slug = 'litsea')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('xarope-de-bordo', 'Xarope de bordo', 'Maple') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'xarope-de-bordo'), 'doce', 1) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('xarope de bordo', (select id from public.notes where slug = 'xarope-de-bordo')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('manjerona', 'Manjerona', 'Marjoram') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'manjerona'), 'aromatico', 0.7) on conflict do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'manjerona'), 'especiado', 0.3) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('manjerona', (select id from public.notes where slug = 'manjerona')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('camomila', 'Camomila', 'Matricaria Chamomilla') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'camomila'), 'aromatico', 0.5) on conflict do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'camomila'), 'floral', 0.3) on conflict do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'camomila'), 'verde', 0.2) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('camomila', (select id from public.notes where slug = 'camomila')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('notas-minerais', 'Notas minerais', 'Mineral') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'notas-minerais'), 'aromatico', 0.4) on conflict do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'notas-minerais'), 'amadeirado', 0.3) on conflict do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'notas-minerais'), 'almiscarado', 0.3) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('notas minerais', (select id from public.notes where slug = 'notas-minerais')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('amendoim', 'Amendoim', 'Peanut') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'amendoim'), 'doce', 0.6) on conflict do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'amendoim'), 'amadeirado', 0.4) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('amendoim', (select id from public.notes where slug = 'amendoim')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('gergelim', 'Gergelim', 'Sesame') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'gergelim'), 'doce', 0.4) on conflict do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'gergelim'), 'amadeirado', 0.4) on conflict do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'gergelim'), 'especiado', 0.2) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('gergelim', (select id from public.notes where slug = 'gergelim')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('notas-solares', 'Notas solares', 'Solar Notes') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'notas-solares'), 'floral', 0.5) on conflict do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'notas-solares'), 'citrico', 0.3) on conflict do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'notas-solares'), 'ambarado', 0.2) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('notas solares', (select id from public.notes where slug = 'notas-solares')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('curcuma', 'Cúrcuma', 'Turmeric') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'curcuma'), 'especiado', 1) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('curcuma', (select id from public.notes where slug = 'curcuma')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('valeriana', 'Valeriana', 'Valeriana Officinalis') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'valeriana'), 'verde', 0.5) on conflict do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'valeriana'), 'amadeirado', 0.5) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('valeriana', (select id from public.notes where slug = 'valeriana')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('ninfeia', 'Ninfeia', 'Water Lily') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'ninfeia'), 'floral', 0.7) on conflict do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'ninfeia'), 'verde', 0.3) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('ninfeia', (select id from public.notes where slug = 'ninfeia')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('cha-branco', 'Chá branco', 'White Tea') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'cha-branco'), 'aromatico', 0.5) on conflict do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'cha-branco'), 'verde', 0.3) on conflict do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'cha-branco'), 'floral', 0.2) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('cha branco', (select id from public.notes where slug = 'cha-branco')) on conflict do nothing;
insert into public.notes (slug, name_pt, name_en) values ('vinho', 'Vinho', 'Wine') on conflict (slug) do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'vinho'), 'frutado', 0.6) on conflict do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'vinho'), 'doce', 0.2) on conflict do nothing;
insert into public.note_accords (note_id, accord_key, weight) values ((select id from public.notes where slug = 'vinho'), 'ambarado', 0.2) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('vinho', (select id from public.notes where slug = 'vinho')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('agarwood', (select id from public.notes where slug = 'oud')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('agarwood (oud)', (select id from public.notes where slug = 'oud')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('aldehydes', (select id from public.notes where slug = 'aldeidos')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('almond', (select id from public.notes where slug = 'amendoa')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('amber', (select id from public.notes where slug = 'ambar')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('amber dry', (select id from public.notes where slug = 'ambar-seco')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('ambergis', (select id from public.notes where slug = 'ambar-gris')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('ambergris', (select id from public.notes where slug = 'ambar-gris')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('amberwood', (select id from public.notes where slug = 'amberwood')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('ambery', (select id from public.notes where slug = 'ambar')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('ambrette', (select id from public.notes where slug = 'ambreta')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('ambrox', (select id from public.notes where slug = 'ambroxan')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('ambroxan', (select id from public.notes where slug = 'ambroxan')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('anise', (select id from public.notes where slug = 'anis')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('apple', (select id from public.notes where slug = 'maca')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('apricot', (select id from public.notes where slug = 'damasco')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('aquatic notes', (select id from public.notes where slug = 'notas-aquaticas')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('artemisia', (select id from public.notes where slug = 'artemisia')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('balsam', (select id from public.notes where slug = 'balsamo')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('balsamic notes', (select id from public.notes where slug = 'notas-balsamicas')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('bamboo', (select id from public.notes where slug = 'bambu')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('banana', (select id from public.notes where slug = 'banana')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('basil', (select id from public.notes where slug = 'manjericao')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('belsamic', (select id from public.notes where slug = 'notas-balsamicas')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('benzoin', (select id from public.notes where slug = 'benjoim')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('bergamot', (select id from public.notes where slug = 'bergamota')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('berries', (select id from public.notes where slug = 'frutas-vermelhas')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('birch', (select id from public.notes where slug = 'betula')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('birch tar', (select id from public.notes where slug = 'alcatrao-de-betula')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('bitter almond', (select id from public.notes where slug = 'amendoa-amarga')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('bitter orange', (select id from public.notes where slug = 'laranja-amarga')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('black cherry', (select id from public.notes where slug = 'cereja-negra')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('black currant', (select id from public.notes where slug = 'cassis')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('black pepper', (select id from public.notes where slug = 'pimenta-preta')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('black tea', (select id from public.notes where slug = 'cha-preto')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('blackberry', (select id from public.notes where slug = 'amora')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('blackcurrant', (select id from public.notes where slug = 'cassis')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('blackcurrant bud', (select id from public.notes where slug = 'broto-de-cassis')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('blood orange', (select id from public.notes where slug = 'laranja-sanguinea')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('bourbon vanilla', (select id from public.notes where slug = 'baunilha-bourbon')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('bread', (select id from public.notes where slug = 'pao')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('bubble gum', (select id from public.notes where slug = 'chiclete')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('bulgarian rose', (select id from public.notes where slug = 'rosa-bulgara')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('butter', (select id from public.notes where slug = 'manteiga')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('butterscotch', (select id from public.notes where slug = 'butterscotch')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('cade', (select id from public.notes where slug = 'cade')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('calone', (select id from public.notes where slug = 'calone')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('caramel', (select id from public.notes where slug = 'caramelo')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('caraway', (select id from public.notes where slug = 'alcaravia')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('cardamo', (select id from public.notes where slug = 'cardamomo')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('cardamom', (select id from public.notes where slug = 'cardamomo')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('cardamon', (select id from public.notes where slug = 'cardamomo')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('carnation', (select id from public.notes where slug = 'cravo-flor')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('casherman', (select id from public.notes where slug = 'cashmeran')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('cashmeran', (select id from public.notes where slug = 'cashmeran')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('cashmere', (select id from public.notes where slug = 'madeira-de-cashmere')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('cashmere wood', (select id from public.notes where slug = 'madeira-de-cashmere')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('cassis', (select id from public.notes where slug = 'cassis')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('castoreum', (select id from public.notes where slug = 'castoreo')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('cedar', (select id from public.notes where slug = 'cedro')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('cedar wood', (select id from public.notes where slug = 'cedro')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('cedarwood', (select id from public.notes where slug = 'cedro')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('cherry', (select id from public.notes where slug = 'cereja')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('chocolate', (select id from public.notes where slug = 'chocolate')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('cinnamon', (select id from public.notes where slug = 'canela')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('cinnamon bark', (select id from public.notes where slug = 'canela')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('cistus labdanum', (select id from public.notes where slug = 'ladano')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('citron', (select id from public.notes where slug = 'cidra')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('civet', (select id from public.notes where slug = 'civeta')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('clary sage', (select id from public.notes where slug = 'salvia-esclareia')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('clove', (select id from public.notes where slug = 'cravo-da-india')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('cloves', (select id from public.notes where slug = 'cravo-da-india')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('cocoa', (select id from public.notes where slug = 'cacau')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('coconut', (select id from public.notes where slug = 'coco')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('coffee', (select id from public.notes where slug = 'cafe')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('coffee arabica', (select id from public.notes where slug = 'cafe-arabica')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('cognac', (select id from public.notes where slug = 'conhaque')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('coriander', (select id from public.notes where slug = 'coentro')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('cotton candy', (select id from public.notes where slug = 'algodao-doce')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('cream', (select id from public.notes where slug = 'creme')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('creamy', (select id from public.notes where slug = 'notas-cremosas')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('cucumber', (select id from public.notes where slug = 'pepino')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('cumin', (select id from public.notes where slug = 'cominho')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('cypress', (select id from public.notes where slug = 'cipreste')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('cypriol', (select id from public.notes where slug = 'cypriol')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('damask rose', (select id from public.notes where slug = 'rosa-damascena')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('date', (select id from public.notes where slug = 'tamara')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('dates', (select id from public.notes where slug = 'tamara')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('davana', (select id from public.notes where slug = 'davana')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('dry amber', (select id from public.notes where slug = 'ambar-seco')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('dry birch', (select id from public.notes where slug = 'betula')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('elemi', (select id from public.notes where slug = 'elemi')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('fig', (select id from public.notes where slug = 'figo')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('fir', (select id from public.notes where slug = 'abeto')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('fir balsam', (select id from public.notes where slug = 'balsamo-de-abeto')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('floral', (select id from public.notes where slug = 'notas-florais')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('floral notes', (select id from public.notes where slug = 'notas-florais')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('frankincense', (select id from public.notes where slug = 'olibano')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('freesia', (select id from public.notes where slug = 'fresia')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('fresia', (select id from public.notes where slug = 'fresia')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('fruity', (select id from public.notes where slug = 'notas-frutadas')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('fruity notes', (select id from public.notes where slug = 'notas-frutadas')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('gardenia', (select id from public.notes where slug = 'gardenia')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('geranium', (select id from public.notes where slug = 'geranio')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('ginger', (select id from public.notes where slug = 'gengibre')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('gourmand', (select id from public.notes where slug = 'notas-gourmand')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('grape', (select id from public.notes where slug = 'uva')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('grapefruit', (select id from public.notes where slug = 'toranja')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('grass', (select id from public.notes where slug = 'grama')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('green apple', (select id from public.notes where slug = 'maca-verde')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('green notes', (select id from public.notes where slug = 'notas-verdes')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('green tea', (select id from public.notes where slug = 'cha-verde')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('guaiac wood', (select id from public.notes where slug = 'guaiaco')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('hazelnut', (select id from public.notes where slug = 'avela')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('hedione', (select id from public.notes where slug = 'hedione')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('heliotrope', (select id from public.notes where slug = 'heliotropio')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('herbal notes', (select id from public.notes where slug = 'notas-herbais')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('honey', (select id from public.notes where slug = 'mel')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('honeysuckle', (select id from public.notes where slug = 'madressilva')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('incense', (select id from public.notes where slug = 'incenso')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('iris', (select id from public.notes where slug = 'iris')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('iso e super', (select id from public.notes where slug = 'iso-e-super')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('jasmine', (select id from public.notes where slug = 'jasmim')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('jasmine sambac', (select id from public.notes where slug = 'jasmim-sambac')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('juniper', (select id from public.notes where slug = 'zimbro')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('kumquat', (select id from public.notes where slug = 'kumquat')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('labdanum', (select id from public.notes where slug = 'ladano')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('lavander', (select id from public.notes where slug = 'lavanda')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('lavender', (select id from public.notes where slug = 'lavanda')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('leather', (select id from public.notes where slug = 'couro')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('lemon', (select id from public.notes where slug = 'limao-siciliano')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('lily', (select id from public.notes where slug = 'lirio')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('lily of the valley', (select id from public.notes where slug = 'lirio-do-vale')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('lime', (select id from public.notes where slug = 'limao')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('lime scent', (select id from public.notes where slug = 'limao')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('litchi', (select id from public.notes where slug = 'lichia')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('lotus', (select id from public.notes where slug = 'lotus')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('lychee', (select id from public.notes where slug = 'lichia')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('madagascar vanilla', (select id from public.notes where slug = 'baunilha-de-madagascar')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('magnolia', (select id from public.notes where slug = 'magnolia')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('mandarin', (select id from public.notes where slug = 'tangerina')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('mandarin orange', (select id from public.notes where slug = 'tangerina')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('mango', (select id from public.notes where slug = 'manga')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('marine', (select id from public.notes where slug = 'notas-marinhas')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('marine notes', (select id from public.notes where slug = 'notas-marinhas')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('marshmallow', (select id from public.notes where slug = 'marshmallow')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('melon', (select id from public.notes where slug = 'melao')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('milk', (select id from public.notes where slug = 'leite')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('mimosa', (select id from public.notes where slug = 'mimosa')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('mint', (select id from public.notes where slug = 'menta')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('moroccan jasmine', (select id from public.notes where slug = 'jasmim-marroquino')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('moss', (select id from public.notes where slug = 'musgo')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('mugwort', (select id from public.notes where slug = 'artemisia')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('musk', (select id from public.notes where slug = 'almiscar')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('musks', (select id from public.notes where slug = 'almiscar')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('musky', (select id from public.notes where slug = 'almiscar')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('myrh', (select id from public.notes where slug = 'mirra')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('myrrh', (select id from public.notes where slug = 'mirra')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('nashi pear', (select id from public.notes where slug = 'pera-nashi')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('neroli', (select id from public.notes where slug = 'neroli')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('nutemag', (select id from public.notes where slug = 'noz-moscada')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('nutmeg', (select id from public.notes where slug = 'noz-moscada')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('oak', (select id from public.notes where slug = 'carvalho')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('oakmoss', (select id from public.notes where slug = 'musgo-de-carvalho')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('olibanum', (select id from public.notes where slug = 'olibano')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('opoponax', (select id from public.notes where slug = 'opoponax')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('orange', (select id from public.notes where slug = 'laranja')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('orange blossom', (select id from public.notes where slug = 'flor-de-laranjeira')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('orange flower', (select id from public.notes where slug = 'flor-de-laranjeira')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('orchid', (select id from public.notes where slug = 'orquidea')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('oriss', (select id from public.notes where slug = 'iris')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('orris', (select id from public.notes where slug = 'iris')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('osmanthus', (select id from public.notes where slug = 'osmanto')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('oud', (select id from public.notes where slug = 'oud')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('oud wood', (select id from public.notes where slug = 'oud')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('ozonic', (select id from public.notes where slug = 'notas-ozonicas')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('ozonic notes', (select id from public.notes where slug = 'notas-ozonicas')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('passion fruit', (select id from public.notes where slug = 'maracuja')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('passionfruit', (select id from public.notes where slug = 'maracuja')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('patchouli', (select id from public.notes where slug = 'patchouli')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('peach', (select id from public.notes where slug = 'pessego')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('pear', (select id from public.notes where slug = 'pera')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('peony', (select id from public.notes where slug = 'peonia')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('pepper', (select id from public.notes where slug = 'pimenta')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('peppermint', (select id from public.notes where slug = 'hortela-pimenta')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('petitgrain', (select id from public.notes where slug = 'petitgrain')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('pimento', (select id from public.notes where slug = 'pimenta-da-jamaica')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('pine', (select id from public.notes where slug = 'pinho')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('pineapple', (select id from public.notes where slug = 'abacaxi')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('pink grapefruit', (select id from public.notes where slug = 'toranja-rosa')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('pink pepper', (select id from public.notes where slug = 'pimenta-rosa')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('pink peppercorn', (select id from public.notes where slug = 'pimenta-rosa')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('pistachio', (select id from public.notes where slug = 'pistache')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('plum', (select id from public.notes where slug = 'ameixa')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('plum accord', (select id from public.notes where slug = 'ameixa')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('pomegranate', (select id from public.notes where slug = 'roma')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('powdery notes', (select id from public.notes where slug = 'notas-atalcadas')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('praline', (select id from public.notes where slug = 'praline')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('raspberry', (select id from public.notes where slug = 'framboesa')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('red fruits', (select id from public.notes where slug = 'frutas-vermelhas')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('resins', (select id from public.notes where slug = 'resinas')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('rhubarb', (select id from public.notes where slug = 'ruibarbo')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('rice', (select id from public.notes where slug = 'arroz')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('rose', (select id from public.notes where slug = 'rosa')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('rose centifolia', (select id from public.notes where slug = 'rosa-centifolia')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('rosemary', (select id from public.notes where slug = 'alecrim')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('rum', (select id from public.notes where slug = 'rum')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('saffron', (select id from public.notes where slug = 'acafrao')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('sage', (select id from public.notes where slug = 'salvia')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('salt', (select id from public.notes where slug = 'sal')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('sandal wood', (select id from public.notes where slug = 'sandalo')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('sandalwood', (select id from public.notes where slug = 'sandalo')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('sea notes', (select id from public.notes where slug = 'notas-marinhas')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('sea salt', (select id from public.notes where slug = 'sal-marinho')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('sichuan pepper', (select id from public.notes where slug = 'pimenta-de-sichuan')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('smoke', (select id from public.notes where slug = 'fumaca')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('smoky', (select id from public.notes where slug = 'notas-defumadas')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('spearmint', (select id from public.notes where slug = 'hortela')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('spices', (select id from public.notes where slug = 'especiarias')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('spicy notes', (select id from public.notes where slug = 'notas-especiadas')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('star anise', (select id from public.notes where slug = 'anis-estrelado')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('strawberry', (select id from public.notes where slug = 'morango')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('styrax', (select id from public.notes where slug = 'estoraque')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('suede', (select id from public.notes where slug = 'camurca')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('sugar', (select id from public.notes where slug = 'acucar')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('taif rose', (select id from public.notes where slug = 'rosa-de-taif')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('tangerine', (select id from public.notes where slug = 'tangerina')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('tea', (select id from public.notes where slug = 'cha')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('thyme', (select id from public.notes where slug = 'tomilho')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('timur berry', (select id from public.notes where slug = 'baga-timur')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('tobacco', (select id from public.notes where slug = 'tabaco')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('tobacco leaf', (select id from public.notes where slug = 'folha-de-tabaco')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('toffee', (select id from public.notes where slug = 'toffee')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('tolu balsam', (select id from public.notes where slug = 'balsamo-de-tolu')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('tomato leaf', (select id from public.notes where slug = 'folha-de-tomate')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('tonka', (select id from public.notes where slug = 'fava-tonka')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('tonka bean', (select id from public.notes where slug = 'fava-tonka')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('tuberose', (select id from public.notes where slug = 'tuberosa')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('turkish rose', (select id from public.notes where slug = 'rosa-turca')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('vanila', (select id from public.notes where slug = 'baunilha')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('vanilla', (select id from public.notes where slug = 'baunilha')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('vetiver', (select id from public.notes where slug = 'vetiver')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('violet', (select id from public.notes where slug = 'violeta')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('violet leaf', (select id from public.notes where slug = 'folha-de-violeta')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('violet leaves', (select id from public.notes where slug = 'folha-de-violeta')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('vitever', (select id from public.notes where slug = 'vetiver')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('voilet', (select id from public.notes where slug = 'violeta')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('watermelon', (select id from public.notes where slug = 'melancia')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('whiskey', (select id from public.notes where slug = 'uisque')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('white amber', (select id from public.notes where slug = 'ambar-branco')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('white flowers', (select id from public.notes where slug = 'flores-brancas')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('white musk', (select id from public.notes where slug = 'almiscar-branco')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('white pepper', (select id from public.notes where slug = 'pimenta-branca')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('woods', (select id from public.notes where slug = 'notas-amadeiradas')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('woody', (select id from public.notes where slug = 'notas-amadeiradas')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('woody notes', (select id from public.notes where slug = 'notas-amadeiradas')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('ylang ylang', (select id from public.notes where slug = 'ylang-ylang')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('ylang-ylang', (select id from public.notes where slug = 'ylang-ylang')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('yuzu', (select id from public.notes where slug = 'yuzu')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('african orange flower', (select id from public.notes where slug = 'flor-de-laranjeira')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('african oud', (select id from public.notes where slug = 'oud')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('african rosemary', (select id from public.notes where slug = 'alecrim')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('akigalawood', (select id from public.notes where slug = 'akigalawood')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('aldehydic notes', (select id from public.notes where slug = 'aldeidos')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('alpine cedarwood', (select id from public.notes where slug = 'cedro')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('amber gris', (select id from public.notes where slug = 'ambar-gris')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('amber wood', (select id from public.notes where slug = 'amberwood')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('amberxtreme', (select id from public.notes where slug = 'amberxtreme')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('ambery notes', (select id from public.notes where slug = 'ambar')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('ambrofix', (select id from public.notes where slug = 'ambrofix')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('ancient woods', (select id from public.notes where slug = 'notas-amadeiradas')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('anis', (select id from public.notes where slug = 'anis')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('aquatic', (select id from public.notes where slug = 'notas-aquaticas')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('arabic coffee', (select id from public.notes where slug = 'cafe-arabica')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('aromatic', (select id from public.notes where slug = 'notas-aromaticas')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('aromatic accord', (select id from public.notes where slug = 'notas-aromaticas')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('aromatic accords', (select id from public.notes where slug = 'notas-aromaticas')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('balsamic', (select id from public.notes where slug = 'notas-balsamicas')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('balsamic accord', (select id from public.notes where slug = 'notas-balsamicas')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('bay leaf', (select id from public.notes where slug = 'louro')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('bergamot italy', (select id from public.notes where slug = 'bergamota')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('berry', (select id from public.notes where slug = 'frutas-vermelhas')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('black current', (select id from public.notes where slug = 'cassis')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('blackcurrent', (select id from public.notes where slug = 'cassis')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('bourbon vetiver', (select id from public.notes where slug = 'vetiver')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('brazilian rosewood', (select id from public.notes where slug = 'pau-rosa')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('brown sugar', (select id from public.notes where slug = 'acucar-mascavo')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('buttery toffee', (select id from public.notes where slug = 'toffee')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('cade wood', (select id from public.notes where slug = 'cade')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('cafe santos', (select id from public.notes where slug = 'cafe')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('calabrian bergamot', (select id from public.notes where slug = 'bergamota')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('cambodian oud', (select id from public.notes where slug = 'oud')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('camelia', (select id from public.notes where slug = 'camelia')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('candied lemon', (select id from public.notes where slug = 'limao')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('candy floss', (select id from public.notes where slug = 'algodao-doce')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('cardamome', (select id from public.notes where slug = 'cardamomo')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('cardomom', (select id from public.notes where slug = 'cardamomo')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('caremel', (select id from public.notes where slug = 'caramelo')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('caribbean lime', (select id from public.notes where slug = 'limao')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('cashmere oud', (select id from public.notes where slug = 'oud')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('cedarwood atlas', (select id from public.notes where slug = 'cedro')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('cedrat', (select id from public.notes where slug = 'cidra')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('champagne', (select id from public.notes where slug = 'champanhe')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('cherry liqueur', (select id from public.notes where slug = 'licor-de-cereja')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('chestnut', (select id from public.notes where slug = 'castanha')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('ciste', (select id from public.notes where slug = 'ladano')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('ciste absolute', (select id from public.notes where slug = 'ladano')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('cistus', (select id from public.notes where slug = 'ladano')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('citrus', (select id from public.notes where slug = 'notas-citricas')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('citrus notes', (select id from public.notes where slug = 'notas-citricas')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('citrus peel', (select id from public.notes where slug = 'notas-citricas')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('cream accord', (select id from public.notes where slug = 'creme')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('crispy apple', (select id from public.notes where slug = 'maca')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('crystal amber', (select id from public.notes where slug = 'ambar')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('cyclamen', (select id from public.notes where slug = 'ciclame')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('cypres', (select id from public.notes where slug = 'cipreste')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('cyproil', (select id from public.notes where slug = 'cypriol')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('damascus rose', (select id from public.notes where slug = 'rosa-damascena')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('dark chocolate', (select id from public.notes where slug = 'chocolate')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('davana oil', (select id from public.notes where slug = 'davana')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('dehn al oudh', (select id from public.notes where slug = 'oud')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('dragon fruit', (select id from public.notes where slug = 'pitaia')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('dry woods', (select id from public.notes where slug = 'notas-amadeiradas')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('elder flower', (select id from public.notes where slug = 'flor-de-sabugueiro')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('elemi metallic', (select id from public.notes where slug = 'elemi')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('elemis', (select id from public.notes where slug = 'elemi')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('eucalyptus', (select id from public.notes where slug = 'eucalipto')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('fig tree wood', (select id from public.notes where slug = 'madeira-de-figueira')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('figs', (select id from public.notes where slug = 'figo')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('fir resin', (select id from public.notes where slug = 'balsamo-de-abeto')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('flint', (select id from public.notes where slug = 'pederneira')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('floral accord', (select id from public.notes where slug = 'notas-florais')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('fluffy marshmallow', (select id from public.notes where slug = 'marshmallow')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('frangipani', (select id from public.notes where slug = 'frangipani')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('frankincense (luban)', (select id from public.notes where slug = 'olibano')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('frankincese', (select id from public.notes where slug = 'olibano')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('fresh', (select id from public.notes where slug = 'notas-frescas')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('fresh spicy', (select id from public.notes where slug = 'notas-especiadas')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('frozen mandarin', (select id from public.notes where slug = 'tangerina')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('fruits', (select id from public.notes where slug = 'notas-frutadas')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('fruity accord', (select id from public.notes where slug = 'notas-frutadas')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('gaiac wood', (select id from public.notes where slug = 'guaiaco')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('galbanum', (select id from public.notes where slug = 'galbano')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('georgywood', (select id from public.notes where slug = 'georgywood')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('geranium accord', (select id from public.notes where slug = 'geranio')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('ginger nigeria', (select id from public.notes where slug = 'gengibre')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('granny smith', (select id from public.notes where slug = 'maca-verde')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('grapefruit accord', (select id from public.notes where slug = 'toranja')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('grapes', (select id from public.notes where slug = 'uva')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('green', (select id from public.notes where slug = 'notas-verdes')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('green leaves', (select id from public.notes where slug = 'notas-verdes')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('green mandarin', (select id from public.notes where slug = 'tangerina')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('green tangerine', (select id from public.notes where slug = 'tangerina')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('guaiacwood', (select id from public.notes where slug = 'guaiaco')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('guava', (select id from public.notes where slug = 'goiaba')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('gurjum', (select id from public.notes where slug = 'balsamo-de-gurjum')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('hibiscus', (select id from public.notes where slug = 'hibisco')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('hyacinth', (select id from public.notes where slug = 'jacinto')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('iced red berries', (select id from public.notes where slug = 'frutas-vermelhas')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('icing pink', (select id from public.notes where slug = 'acucar')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('indian agarwood', (select id from public.notes where slug = 'oud')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('indian oud', (select id from public.notes where slug = 'oud')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('indian rose', (select id from public.notes where slug = 'rosa')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('indian sandalwood', (select id from public.notes where slug = 'sandalo')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('indonesian oud', (select id from public.notes where slug = 'oud')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('indonesian patchouli', (select id from public.notes where slug = 'patchouli')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('indonesian vetivar oil', (select id from public.notes where slug = 'vetiver')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('italian bergamot', (select id from public.notes where slug = 'bergamota')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('italian plum', (select id from public.notes where slug = 'ameixa')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('jasmin', (select id from public.notes where slug = 'jasmim')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('juniper berries', (select id from public.notes where slug = 'zimbro')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('juniper berry', (select id from public.notes where slug = 'zimbro')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('kiwi', (select id from public.notes where slug = 'kiwi')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('lavandin', (select id from public.notes where slug = 'lavanda')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('leathery accord', (select id from public.notes where slug = 'couro')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('lemon tree', (select id from public.notes where slug = 'limao')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('lemon zest bitter', (select id from public.notes where slug = 'limao')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('lilac', (select id from public.notes where slug = 'lilas')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('liquorice', (select id from public.notes where slug = 'alcacuz')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('liquorous', (select id from public.notes where slug = 'notas-licorosas')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('lotus flower', (select id from public.notes where slug = 'lotus')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('loukhoum', (select id from public.notes where slug = 'loukoum')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('madagascar clove leaf', (select id from public.notes where slug = 'cravo-da-india')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('madagascar vanilla caviar', (select id from public.notes where slug = 'baunilha-de-madagascar')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('mahonia', (select id from public.notes where slug = 'mahonia')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('mahonial', (select id from public.notes where slug = 'mahonia')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('mandarin zest', (select id from public.notes where slug = 'tangerina')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('marina notes', (select id from public.notes where slug = 'notas-marinhas')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('marine accord', (select id from public.notes where slug = 'notas-marinhas')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('milk accord', (select id from public.notes where slug = 'leite')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('milk heart', (select id from public.notes where slug = 'leite')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('mineral amber', (select id from public.notes where slug = 'ambar')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('molasses', (select id from public.notes where slug = 'melaco')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('muget', (select id from public.notes where slug = 'lirio-do-vale')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('muguet', (select id from public.notes where slug = 'lirio-do-vale')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('nagarmotha', (select id from public.notes where slug = 'cypriol')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('narcissus', (select id from public.notes where slug = 'narciso')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('nectarine', (select id from public.notes where slug = 'nectarina')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('nut', (select id from public.notes where slug = 'nozes')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('nutgrass', (select id from public.notes where slug = 'cypriol')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('nutty', (select id from public.notes where slug = 'nozes')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('oak moss', (select id from public.notes where slug = 'musgo-de-carvalho')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('oakwood', (select id from public.notes where slug = 'carvalho')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('oregano', (select id from public.notes where slug = 'oregano')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('oud accord', (select id from public.notes where slug = 'oud')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('oudh', (select id from public.notes where slug = 'oud')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('oudh from assam', (select id from public.notes where slug = 'oud')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('ozonics', (select id from public.notes where slug = 'notas-ozonicas')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('pachouli', (select id from public.notes where slug = 'patchouli')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('palo santo', (select id from public.notes where slug = 'palo-santo')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('panna cotta', (select id from public.notes where slug = 'notas-cremosas')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('papaya', (select id from public.notes where slug = 'mamao')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('peach blossom', (select id from public.notes where slug = 'flor-de-pessegueiro')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('peach nectar', (select id from public.notes where slug = 'pessego')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('pear blossom', (select id from public.notes where slug = 'flor-de-pereira')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('pelargonium', (select id from public.notes where slug = 'geranio')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('pepper pink', (select id from public.notes where slug = 'pimenta-rosa')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('peru balsam', (select id from public.notes where slug = 'balsamo-do-peru')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('petalia', (select id from public.notes where slug = 'petalia')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('pine tree', (select id from public.notes where slug = 'pinho')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('pink pepper madagascar', (select id from public.notes where slug = 'pimenta-rosa')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('pink peppercorns', (select id from public.notes where slug = 'pimenta-rosa')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('pistachio gelato', (select id from public.notes where slug = 'pistache')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('pitahaya', (select id from public.notes where slug = 'pitaia')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('plum blossom', (select id from public.notes where slug = 'flor-de-ameixeira')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('pop corn', (select id from public.notes where slug = 'pipoca')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('powder', (select id from public.notes where slug = 'notas-atalcadas')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('powdered sugar', (select id from public.notes where slug = 'acucar')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('powdery', (select id from public.notes where slug = 'notas-atalcadas')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('precious woods', (select id from public.notes where slug = 'notas-amadeiradas')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('red berries', (select id from public.notes where slug = 'frutas-vermelhas')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('redcurrant', (select id from public.notes where slug = 'groselha')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('rhuburb', (select id from public.notes where slug = 'ruibarbo')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('rose damacena', (select id from public.notes where slug = 'rosa-damascena')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('rose petals', (select id from public.notes where slug = 'rosa')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('rosewood', (select id from public.notes where slug = 'pau-rosa')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('rosyfolia', (select id from public.notes where slug = 'rosyfolia')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('sambac', (select id from public.notes where slug = 'jasmim-sambac')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('sambac india', (select id from public.notes where slug = 'jasmim-sambac')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('sandal', (select id from public.notes where slug = 'sandalo')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('sandlwood', (select id from public.notes where slug = 'sandalo')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('shama amber', (select id from public.notes where slug = 'ambar')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('siam benzoin', (select id from public.notes where slug = 'benjoim')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('soft patchouli', (select id from public.notes where slug = 'patchouli')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('softwood', (select id from public.notes where slug = 'notas-amadeiradas')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('sour cherry', (select id from public.notes where slug = 'cereja')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('spanish saffron', (select id from public.notes where slug = 'acafrao')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('spicy', (select id from public.notes where slug = 'notas-especiadas')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('spicy accord', (select id from public.notes where slug = 'notas-especiadas')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('sugary', (select id from public.notes where slug = 'notas-doces')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('sugary accords', (select id from public.notes where slug = 'notas-doces')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('sweet', (select id from public.notes where slug = 'notas-doces')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('sweet almond', (select id from public.notes where slug = 'amendoa')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('sweet amber', (select id from public.notes where slug = 'ambar')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('sweet musk', (select id from public.notes where slug = 'almiscar')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('teak wood', (select id from public.notes where slug = 'madeira-de-teca')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('thai basil', (select id from public.notes where slug = 'manjericao')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('tiare blossoms', (select id from public.notes where slug = 'flor-de-tiare')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('tonka bean absolute', (select id from public.notes where slug = 'fava-tonka')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('tonka beans', (select id from public.notes where slug = 'fava-tonka')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('tree blossoms', (select id from public.notes where slug = 'notas-florais')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('tropical fruits', (select id from public.notes where slug = 'notas-frutadas')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('tunisian orange flower', (select id from public.notes where slug = 'flor-de-laranjeira')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('turkish rose absolute', (select id from public.notes where slug = 'rosa-turca')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('vanilla bourbon', (select id from public.notes where slug = 'baunilha-bourbon')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('vanilla bourbon absolute', (select id from public.notes where slug = 'baunilha-bourbon')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('verbena', (select id from public.notes where slug = 'verbena')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('vetivar', (select id from public.notes where slug = 'vetiver')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('vetiver haiti', (select id from public.notes where slug = 'vetiver')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('vetyvalone', (select id from public.notes where slug = 'vetiver')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('virginia cedar', (select id from public.notes where slug = 'cedro')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('warm spicy', (select id from public.notes where slug = 'notas-especiadas')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('watery accord', (select id from public.notes where slug = 'notas-aquaticas')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('whipped cream', (select id from public.notes where slug = 'creme')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('white floral', (select id from public.notes where slug = 'flores-brancas')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('white florals', (select id from public.notes where slug = 'flores-brancas')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('white flower', (select id from public.notes where slug = 'flores-brancas')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('white jasmine', (select id from public.notes where slug = 'jasmim')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('white musks', (select id from public.notes where slug = 'almiscar-branco')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('white peach', (select id from public.notes where slug = 'pessego')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('white rose', (select id from public.notes where slug = 'rosa')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('white saffron', (select id from public.notes where slug = 'acafrao')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('white wood', (select id from public.notes where slug = 'notas-amadeiradas')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('white woods', (select id from public.notes where slug = 'notas-amadeiradas')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('wild artemisia', (select id from public.notes where slug = 'artemisia')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('wild berries', (select id from public.notes where slug = 'frutas-vermelhas')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('williams pear', (select id from public.notes where slug = 'pera')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('wintery vetiver', (select id from public.notes where slug = 'vetiver')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('wood', (select id from public.notes where slug = 'notas-amadeiradas')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('wood lemon', (select id from public.notes where slug = 'limao')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('ylang', (select id from public.notes where slug = 'ylang-ylang')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('abelmoschus moschatus', (select id from public.notes where slug = 'ambreta')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('ambrette seed', (select id from public.notes where slug = 'ambreta')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('ambrettolide', (select id from public.notes where slug = 'ambreta')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('abies balsamea', (select id from public.notes where slug = 'balsamo-de-abeto')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('acacia dealbata', (select id from public.notes where slug = 'mimosa')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('algal', (select id from public.notes where slug = 'notas-marinhas')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('sea', (select id from public.notes where slug = 'notas-marinhas')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('almond blossom', (select id from public.notes where slug = 'flor-de-amendoeira')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('amyris', (select id from public.notes where slug = 'amyris')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('angelica', (select id from public.notes where slug = 'angelica')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('angelica root', (select id from public.notes where slug = 'angelica')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('anise seed', (select id from public.notes where slug = 'anis')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('apples', (select id from public.notes where slug = 'maca')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('apricot fruit', (select id from public.notes where slug = 'damasco')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('aquaflora', (select id from public.notes where slug = 'notas-aquaticas')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('banana blossom', (select id from public.notes where slug = 'flor-de-bananeira')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('beeswax', (select id from public.notes where slug = 'cera-de-abelha')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('beeswax absolute', (select id from public.notes where slug = 'cera-de-abelha')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('bigarade', (select id from public.notes where slug = 'laranja-amarga')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('blackcurrant leaf', (select id from public.notes where slug = 'broto-de-cassis')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('blonde wood', (select id from public.notes where slug = 'notas-amadeiradas')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('driftwood', (select id from public.notes where slug = 'notas-amadeiradas')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('transparent woods', (select id from public.notes where slug = 'notas-amadeiradas')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('blood grapefruit', (select id from public.notes where slug = 'toranja')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('buddha''s hand', (select id from public.notes where slug = 'cidra')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('camphorwood', (select id from public.notes where slug = 'canfora')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('candied fruit', (select id from public.notes where slug = 'notas-frutadas')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('candied ginger', (select id from public.notes where slug = 'gengibre')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('candied rose', (select id from public.notes where slug = 'rosa')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('casablanca lily', (select id from public.notes where slug = 'lirio')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('lilies', (select id from public.notes where slug = 'lirio')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('chinese osmanthus', (select id from public.notes where slug = 'osmanto')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('osmanthus absolute', (select id from public.notes where slug = 'osmanto')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('citrus sinensis', (select id from public.notes where slug = 'laranja')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('cola', (select id from public.notes where slug = 'cola')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('coumarin', (select id from public.notes where slug = 'cumarina')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('cytisus scoparius', (select id from public.notes where slug = 'giesta')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('diesel exhaust', (select id from public.notes where slug = 'notas-defumadas')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('durian', (select id from public.notes where slug = 'duriao')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('dusty', (select id from public.notes where slug = 'notas-atalcadas')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('fringed pink', (select id from public.notes where slug = 'cravo-flor')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('gourmand accord', (select id from public.notes where slug = 'notas-gourmand')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('grapefruit blossom', (select id from public.notes where slug = 'flor-de-toranja')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('green pear', (select id from public.notes where slug = 'pera')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('koji pear', (select id from public.notes where slug = 'pera')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('haitian vetiver', (select id from public.notes where slug = 'vetiver')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('horchata', (select id from public.notes where slug = 'horchata')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('hyacinth flowers', (select id from public.notes where slug = 'jacinto')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('immortelle', (select id from public.notes where slug = 'imortela')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('iris butter', (select id from public.notes where slug = 'iris')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('orris root', (select id from public.notes where slug = 'iris')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('jasminum sambac', (select id from public.notes where slug = 'jasmim-sambac')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('juniperus virginiana', (select id from public.notes where slug = 'cedro')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('virginia cedarwood', (select id from public.notes where slug = 'cedro')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('labdanum absolute', (select id from public.notes where slug = 'ladano')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('lemon leaf oil', (select id from public.notes where slug = 'limao')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('lemon verbena', (select id from public.notes where slug = 'verbena')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('lily-of-the-valley', (select id from public.notes where slug = 'lirio-do-vale')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('litsea cubeba', (select id from public.notes where slug = 'litsea')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('magnolia flowers', (select id from public.notes where slug = 'magnolia')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('maple', (select id from public.notes where slug = 'xarope-de-bordo')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('maple syrup', (select id from public.notes where slug = 'xarope-de-bordo')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('marjoram', (select id from public.notes where slug = 'manjerona')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('matricaria chamomilla', (select id from public.notes where slug = 'camomila')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('methyl benzodioxepinone', (select id from public.notes where slug = 'calone')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('mineral', (select id from public.notes where slug = 'notas-minerais')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('sand', (select id from public.notes where slug = 'notas-minerais')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('moroccan orange blossom', (select id from public.notes where slug = 'flor-de-laranjeira')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('mysore sandalwood', (select id from public.notes where slug = 'sandalo')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('narcissus flowers', (select id from public.notes where slug = 'narciso')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('orcanox', (select id from public.notes where slug = 'ambar-gris')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('papaya fruit', (select id from public.notes where slug = 'mamao')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('peach fruit', (select id from public.notes where slug = 'pessego')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('peanut', (select id from public.notes where slug = 'amendoim')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('pine resin', (select id from public.notes where slug = 'resinas')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('popcorn', (select id from public.notes where slug = 'pipoca')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('red currant', (select id from public.notes where slug = 'groselha')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('rosa × centifolia', (select id from public.notes where slug = 'rosa-centifolia')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('rose absolute', (select id from public.notes where slug = 'rosa')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('rose water', (select id from public.notes where slug = 'rosa')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('salvia rosmarinus', (select id from public.notes where slug = 'alecrim')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('sesame', (select id from public.notes where slug = 'gergelim')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('sicilian lemon', (select id from public.notes where slug = 'limao-siciliano')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('sicilian mandarin orange', (select id from public.notes where slug = 'tangerina')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('tangelo', (select id from public.notes where slug = 'tangerina')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('solar notes', (select id from public.notes where slug = 'notas-solares')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('syringa', (select id from public.notes where slug = 'lilas')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('tea absolute', (select id from public.notes where slug = 'cha')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('thyme oil', (select id from public.notes where slug = 'tomilho')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('tiare', (select id from public.notes where slug = 'flor-de-tiare')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('turmeric', (select id from public.notes where slug = 'curcuma')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('valeriana officinalis', (select id from public.notes where slug = 'valeriana')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('vanilla absolute', (select id from public.notes where slug = 'baunilha')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('vanillin', (select id from public.notes where slug = 'baunilha')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('white vanilla', (select id from public.notes where slug = 'baunilha')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('violets', (select id from public.notes where slug = 'violeta')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('water lily', (select id from public.notes where slug = 'ninfeia')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('white tea', (select id from public.notes where slug = 'cha-branco')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('wine', (select id from public.notes where slug = 'vinho')) on conflict do nothing;
insert into public.note_aliases (alias, note_id) values ('zanthoxylum armatum', (select id from public.notes where slug = 'baga-timur')) on conflict do nothing;
insert into public.import_drafts (source, url, brand_slug, payload, status, perfume_id, fetched_at) values ('wikidata', 'https://www.wikidata.org/wiki/Q139265288', '4160-tuesdays', '{"url":"https://www.wikidata.org/wiki/Q139265288","name":"Take Me to the River","brand":"4160 Tuesdays","brandName":"4160 Tuesdays","brandSlug":"4160-tuesdays","size":null,"gender":null,"year":2018,"perfumers":["Sarah McCartney"],"sourceLabel":"Wikidata (CC0)","notesStatus":"a-confirmar","notesNote":"Pirâmide do Wikidata (base colaborativa, licença CC0). Conferir com a marca antes de publicar.","fetchedAt":"2026-10-25T22:35:10.709Z","notesEn":{"top":["rum","rose","wine"],"heart":["patchouli","beeswax","tobacco"],"base":["musk","amber","leather"]},"notes":{"top":["Rum","Rosa","Vinho"],"heart":["Patchouli","Cera de abelha","Tabaco"],"base":["Almíscar","Âmbar","Couro"]},"unknownNotes":[],"review":"ok"}'::jsonb,
  'pendente', null, '2026-10-25T22:35:10.709Z')
  on conflict (url) do update set payload = excluded.payload, fetched_at = excluded.fetched_at where public.import_drafts.status = 'pendente';
insert into public.import_drafts (source, url, brand_slug, payload, status, perfume_id, fetched_at) values ('wikidata', 'https://www.wikidata.org/wiki/Q137527355', 'boka-fragrance', '{"url":"https://www.wikidata.org/wiki/Q137527355","name":"Zelen","brand":"Boka Fragrance","brandName":"Boka Fragrance","brandSlug":"boka-fragrance","size":null,"gender":null,"year":2023,"perfumers":["Boris Zrnic"],"sourceLabel":"Wikidata (CC0)","notesStatus":"a-confirmar","notesNote":"Pirâmide do Wikidata (base colaborativa, licença CC0). Conferir com a marca antes de publicar.","fetchedAt":"2026-10-25T22:35:10.709Z","notesEn":{"top":["lime","yuzu","bergamot"],"heart":["pink pepper","beeswax","cardamom"],"base":["Haitian vetiver","Virginia cedarwood","Mysore sandalwood"]},"notes":{"top":["Limão","Yuzu","Bergamota"],"heart":["Pimenta-rosa","Cera de abelha","Cardamomo"],"base":["Vetiver","Cedro","Sândalo"]},"unknownNotes":[],"review":"ok"}'::jsonb,
  'pendente', null, '2026-10-25T22:35:10.709Z')
  on conflict (url) do update set payload = excluded.payload, fetched_at = excluded.fetched_at where public.import_drafts.status = 'pendente';
insert into public.import_drafts (source, url, brand_slug, payload, status, perfume_id, fetched_at) values ('wikidata', 'https://www.wikidata.org/wiki/Q140406909', 'borntostandout', '{"url":"https://www.wikidata.org/wiki/Q140406909","name":"Gold Juice","brand":"BORNTOSTANDOUT","brandName":"BORNTOSTANDOUT","brandSlug":"borntostandout","size":null,"gender":null,"year":2025,"perfumers":["Margaux Le Paih Guérin"],"sourceLabel":"Wikidata (CC0)","notesStatus":"a-confirmar","notesNote":"Pirâmide do Wikidata (base colaborativa, licença CC0). Conferir com a marca antes de publicar.","fetchedAt":"2026-10-25T22:35:10.710Z","notesEn":{"top":["rhubarb","durian","mango"],"heart":["osmanthus absolute","white flowers","solar notes"],"base":["caramel","almond","guaiac wood"]},"notes":{"top":["Ruibarbo","Durião","Manga"],"heart":["Osmanto","Flores brancas","Notas solares"],"base":["Caramelo","Amêndoa","Guaiaco"]},"unknownNotes":[],"review":"ok"}'::jsonb,
  'pendente', null, '2026-10-25T22:35:10.710Z')
  on conflict (url) do update set payload = excluded.payload, fetched_at = excluded.fetched_at where public.import_drafts.status = 'pendente';
insert into public.import_drafts (source, url, brand_slug, payload, status, perfume_id, fetched_at) values ('wikidata', 'https://www.wikidata.org/wiki/Q141482725', 'borntostandout', '{"url":"https://www.wikidata.org/wiki/Q141482725","name":"Melón Malo","brand":"BORNTOSTANDOUT","brandName":"BORNTOSTANDOUT","brandSlug":"borntostandout","size":null,"gender":null,"year":2026,"perfumers":["Jordi Fernández"],"sourceLabel":"Wikidata (CC0)","notesStatus":"a-confirmar","notesNote":"Pirâmide do Wikidata (base colaborativa, licença CC0). Conferir com a marca antes de publicar.","fetchedAt":"2026-10-25T22:35:10.710Z","notesEn":{"top":["melon","candied ginger"],"heart":[],"base":[]},"notes":{"top":["Melão","Gengibre"],"heart":[],"base":[]},"unknownNotes":[],"review":"ok"}'::jsonb,
  'pendente', null, '2026-10-25T22:35:10.710Z')
  on conflict (url) do update set payload = excluded.payload, fetched_at = excluded.fetched_at where public.import_drafts.status = 'pendente';
insert into public.import_drafts (source, url, brand_slug, payload, status, perfume_id, fetched_at) values ('wikidata', 'https://www.wikidata.org/wiki/Q141761243', 'borntostandout', '{"url":"https://www.wikidata.org/wiki/Q141761243","name":"Saint Petal","brand":"BORNTOSTANDOUT","brandName":"BORNTOSTANDOUT","brandSlug":"borntostandout","size":null,"gender":null,"year":2026,"perfumers":["Jordi Fernández"],"sourceLabel":"Wikidata (CC0)","notesStatus":"a-confirmar","notesNote":"Pirâmide do Wikidata (base colaborativa, licença CC0). Conferir com a marca antes de publicar.","fetchedAt":"2026-10-25T22:35:10.710Z","notesEn":{"top":["orange blossom","cumin","bergamot","dusty"],"heart":["Jasminum sambac","coffee","incense","akigalawood"],"base":["amyris","vetiver","cistus","oud","leather"]},"notes":{"top":["Flor de laranjeira","Cominho","Bergamota","Notas atalcadas"],"heart":["Jasmim sambac","Café","Incenso","Akigalawood"],"base":["Amyris","Vetiver","Ládano","Oud","Couro"]},"unknownNotes":[],"review":"ok"}'::jsonb,
  'pendente', null, '2026-10-25T22:35:10.710Z')
  on conflict (url) do update set payload = excluded.payload, fetched_at = excluded.fetched_at where public.import_drafts.status = 'pendente';
insert into public.import_drafts (source, url, brand_slug, payload, status, perfume_id, fetched_at) values ('wikidata', 'https://www.wikidata.org/wiki/Q141760078', 'brain-dead', '{"url":"https://www.wikidata.org/wiki/Q141760078","name":"Goldblooming","brand":"Brain Dead","brandName":"Brain Dead","brandSlug":"brain-dead","size":null,"gender":null,"year":2025,"perfumers":["Maak Lab"],"sourceLabel":"Wikidata (CC0)","notesStatus":"a-confirmar","notesNote":"Pirâmide do Wikidata (base colaborativa, licença CC0). Conferir com a marca antes de publicar.","fetchedAt":"2026-10-25T22:35:10.710Z","notesEn":{"top":["sandalwood","tobacco","leather","white musk"],"heart":["orris root","clary sage","tea absolute"],"base":["woody","maple","hazelnut","suede","saffron"]},"notes":{"top":["Sândalo","Tabaco","Couro","Almíscar branco"],"heart":["Íris","Sálvia-esclareia","Chá"],"base":["Notas amadeiradas","Xarope de bordo","Avelã","Camurça","Açafrão"]},"unknownNotes":[],"review":"ok"}'::jsonb,
  'pendente', null, '2026-10-25T22:35:10.710Z')
  on conflict (url) do update set payload = excluded.payload, fetched_at = excluded.fetched_at where public.import_drafts.status = 'pendente';
insert into public.import_drafts (source, url, brand_slug, payload, status, perfume_id, fetched_at) values ('wikidata', 'https://www.wikidata.org/wiki/Q138795798', 'byredo', '{"url":"https://www.wikidata.org/wiki/Q138795798","name":"Deep Viola","brand":"Byredo","brandName":"Byredo","brandSlug":"byredo","size":null,"gender":null,"year":2020,"perfumers":null,"sourceLabel":"Wikidata (CC0)","notesStatus":"a-confirmar","notesNote":"Pirâmide do Wikidata (base colaborativa, licença CC0). Conferir com a marca antes de publicar.","fetchedAt":"2026-10-25T22:35:10.709Z","notesEn":{"top":["angelica","saffron","bergamot"],"heart":["leather","violets","iris"],"base":["frankincense","oud","vanilla"]},"notes":{"top":["Angélica","Açafrão","Bergamota"],"heart":["Couro","Violeta","Íris"],"base":["Olíbano","Oud","Baunilha"]},"unknownNotes":[],"review":"ok"}'::jsonb,
  'pendente', null, '2026-10-25T22:35:10.709Z')
  on conflict (url) do update set payload = excluded.payload, fetched_at = excluded.fetched_at where public.import_drafts.status = 'pendente';
insert into public.import_drafts (source, url, brand_slug, payload, status, perfume_id, fetched_at) values ('wikidata', 'https://www.wikidata.org/wiki/Q141099579', 'byredo', '{"url":"https://www.wikidata.org/wiki/Q141099579","name":"Future Memories","brand":"Byredo","brandName":"Byredo","brandSlug":"byredo","size":null,"gender":null,"year":2026,"perfumers":["Givaudan S.A.","Quentin Bisch"],"sourceLabel":"Wikidata (CC0)","notesStatus":"a-confirmar","notesNote":"Pirâmide do Wikidata (base colaborativa, licença CC0). Conferir com a marca antes de publicar.","fetchedAt":"2026-10-25T22:35:10.710Z","notesEn":{"top":["blackcurrant","aldehydes","galbanum"],"heart":["labdanum","iris butter","orange blossom","white vanilla"],"base":["musk","Madagascar vanilla","vanilla","ambrofix"]},"notes":{"top":["Cassis","Aldeídos","galbano"],"heart":["Ládano","Íris","Flor de laranjeira","Baunilha"],"base":["Almíscar","Baunilha de Madagascar","Baunilha","Ambrofix™"]},"unknownNotes":[],"review":"ok"}'::jsonb,
  'pendente', null, '2026-10-25T22:35:10.710Z')
  on conflict (url) do update set payload = excluded.payload, fetched_at = excluded.fetched_at where public.import_drafts.status = 'pendente';
insert into public.import_drafts (source, url, brand_slug, payload, status, perfume_id, fetched_at) values ('wikidata', 'https://www.wikidata.org/wiki/Q3733683', 'calvin-klein', '{"url":"https://www.wikidata.org/wiki/Q3733683","name":"Eternity","brand":"Calvin Klein","brandName":"Calvin Klein","brandSlug":"calvin-klein","size":null,"gender":"Feminino","year":1988,"perfumers":["Sophia Grojsman"],"sourceLabel":"Wikidata (CC0)","notesStatus":"a-confirmar","notesNote":"Pirâmide do Wikidata (base colaborativa, licença CC0). Conferir com a marca antes de publicar.","fetchedAt":"2026-10-25T22:35:10.708Z","notesEn":{"top":["freesia","sage","citrus","mandarin orange"],"heart":["carnation","lilies","lily-of-the-valley","narcissus flowers","violets","rose","jasmine"],"base":["musk","heliotrope","sandalwood","amber","patchouli"]},"notes":{"top":["Frésia","Sálvia","Notas cítricas","Tangerina"],"heart":["Cravo (flor)","Lírio","Lírio-do-vale","Narciso","Violeta","Rosa","Jasmim"],"base":["Almíscar","Heliotrópio","Sândalo","Âmbar","Patchouli"]},"unknownNotes":[],"review":"ok"}'::jsonb,
  'pendente', null, '2026-10-25T22:35:10.708Z')
  on conflict (url) do update set payload = excluded.payload, fetched_at = excluded.fetched_at where public.import_drafts.status = 'pendente';
insert into public.import_drafts (source, url, brand_slug, payload, status, perfume_id, fetched_at) values ('wikidata', 'https://www.wikidata.org/wiki/Q140013590', 'calvin-klein', '{"url":"https://www.wikidata.org/wiki/Q140013590","name":"Eternity Aqua","brand":"Calvin Klein","brandName":"Calvin Klein","brandSlug":"calvin-klein","size":null,"gender":null,"year":2012,"perfumers":null,"sourceLabel":"Wikidata (CC0)","notesStatus":"a-confirmar","notesNote":"Pirâmide do Wikidata (base colaborativa, licença CC0). Conferir com a marca antes de publicar.","fetchedAt":"2026-10-25T22:35:10.709Z","notesEn":{"top":["peony","apricot fruit"],"heart":["magnolia flowers","jasmine","gardenia","tiaré"],"base":["musk","cedarwood","woody"]},"notes":{"top":["Peônia","Damasco"],"heart":["Magnólia","Jasmim","Gardênia","Flor de tiaré"],"base":["Almíscar","Cedro","Notas amadeiradas"]},"unknownNotes":[],"review":"ok"}'::jsonb,
  'pendente', null, '2026-10-25T22:35:10.709Z')
  on conflict (url) do update set payload = excluded.payload, fetched_at = excluded.fetched_at where public.import_drafts.status = 'pendente';
insert into public.import_drafts (source, url, brand_slug, payload, status, perfume_id, fetched_at) values ('wikidata', 'https://www.wikidata.org/wiki/Q140014562', 'calvin-klein', '{"url":"https://www.wikidata.org/wiki/Q140014562","name":"Eternity Aqua for Men","brand":"Calvin Klein","brandName":"Calvin Klein","brandSlug":"calvin-klein","size":null,"gender":null,"year":2010,"perfumers":null,"sourceLabel":"Wikidata (CC0)","notesStatus":"a-confirmar","notesNote":"Pirâmide do Wikidata (base colaborativa, licença CC0). Conferir com a marca antes de publicar.","fetchedAt":"2026-10-25T22:35:10.710Z","notesEn":{"top":["citrus"],"heart":["lavender"],"base":["musk","sandalwood","patchouli"]},"notes":{"top":["Notas cítricas"],"heart":["Lavanda"],"base":["Almíscar","Sândalo","Patchouli"]},"unknownNotes":[],"review":"ok"}'::jsonb,
  'pendente', null, '2026-10-25T22:35:10.710Z')
  on conflict (url) do update set payload = excluded.payload, fetched_at = excluded.fetched_at where public.import_drafts.status = 'pendente';
insert into public.import_drafts (source, url, brand_slug, payload, status, perfume_id, fetched_at) values ('wikidata', 'https://www.wikidata.org/wiki/Q140011937', 'calvin-klein', '{"url":"https://www.wikidata.org/wiki/Q140011937","name":"Eternity Flame","brand":"Calvin Klein","brandName":"Calvin Klein","brandSlug":"calvin-klein","size":null,"gender":null,"year":2019,"perfumers":null,"sourceLabel":"Wikidata (CC0)","notesStatus":"a-confirmar","notesNote":"Pirâmide do Wikidata (base colaborativa, licença CC0). Conferir com a marca antes de publicar.","fetchedAt":"2026-10-25T22:35:10.709Z","notesEn":{"top":["mandarin orange"],"heart":[],"base":["labdanum"]},"notes":{"top":["Tangerina"],"heart":[],"base":["Ládano"]},"unknownNotes":[],"review":"ok"}'::jsonb,
  'pendente', null, '2026-10-25T22:35:10.709Z')
  on conflict (url) do update set payload = excluded.payload, fetched_at = excluded.fetched_at where public.import_drafts.status = 'pendente';
insert into public.import_drafts (source, url, brand_slug, payload, status, perfume_id, fetched_at) values ('wikidata', 'https://www.wikidata.org/wiki/Q140012833', 'calvin-klein', '{"url":"https://www.wikidata.org/wiki/Q140012833","name":"Eternity Flame For Men","brand":"Calvin Klein","brandName":"Calvin Klein","brandSlug":"calvin-klein","size":null,"gender":null,"year":2019,"perfumers":null,"sourceLabel":"Wikidata (CC0)","notesStatus":"a-confirmar","notesNote":"Pirâmide do Wikidata (base colaborativa, licença CC0). Conferir com a marca antes de publicar.","fetchedAt":"2026-10-25T22:35:10.709Z","notesEn":{"top":["pineapple"],"heart":[],"base":["amber","leather","labdanum"]},"notes":{"top":["Abacaxi"],"heart":[],"base":["Âmbar","Couro","Ládano"]},"unknownNotes":[],"review":"ok"}'::jsonb,
  'pendente', null, '2026-10-25T22:35:10.709Z')
  on conflict (url) do update set payload = excluded.payload, fetched_at = excluded.fetched_at where public.import_drafts.status = 'pendente';
insert into public.import_drafts (source, url, brand_slug, payload, status, perfume_id, fetched_at) values ('wikidata', 'https://www.wikidata.org/wiki/Q140003880', 'calvin-klein', '{"url":"https://www.wikidata.org/wiki/Q140003880","name":"Eternity for Men (1990)","brand":"Calvin Klein","brandName":"Calvin Klein","brandSlug":"calvin-klein","size":null,"gender":null,"year":1990,"perfumers":["Carlos Benaim"],"sourceLabel":"Wikidata (CC0)","notesStatus":"a-confirmar","notesNote":"Pirâmide do Wikidata (base colaborativa, licença CC0). Conferir com a marca antes de publicar.","fetchedAt":"2026-10-25T22:35:10.709Z","notesEn":{"top":["lavender","lemon","bergamot","mandarin orange"],"heart":["sage","juniper berry","basil","geranium","jasmine","coriander","orange blossom","lily-of-the-valley","lilies"],"base":["sandalwood","musk","vetiver","amber"]},"notes":{"top":["Lavanda","Limão-siciliano","Bergamota","Tangerina"],"heart":["Sálvia","Zimbro","Manjericão","Gerânio","Jasmim","Coentro","Flor de laranjeira","Lírio-do-vale","Lírio"],"base":["Sândalo","Almíscar","Vetiver","Âmbar"]},"unknownNotes":[],"review":"ok"}'::jsonb,
  'pendente', null, '2026-10-25T22:35:10.709Z')
  on conflict (url) do update set payload = excluded.payload, fetched_at = excluded.fetched_at where public.import_drafts.status = 'pendente';
insert into public.import_drafts (source, url, brand_slug, payload, status, perfume_id, fetched_at) values ('wikidata', 'https://www.wikidata.org/wiki/Q140003843', 'calvin-klein', '{"url":"https://www.wikidata.org/wiki/Q140003843","name":"Eternity for Men (2019)","brand":"Calvin Klein","brandName":"Calvin Klein","brandSlug":"calvin-klein","size":null,"gender":"Masculino","year":2019,"perfumers":null,"sourceLabel":"Wikidata (CC0)","notesStatus":"a-confirmar","notesNote":"Pirâmide do Wikidata (base colaborativa, licença CC0). Conferir com a marca antes de publicar.","fetchedAt":"2026-10-25T22:35:10.709Z","notesEn":{"top":["apples","sage"],"heart":["lavender","geranium","nutmeg"],"base":["suede","ambergris","nagarmotha","orris root"]},"notes":{"top":["Maçã","Sálvia"],"heart":["Lavanda","Gerânio","Noz-moscada"],"base":["Camurça","Âmbar-gris","Cypriol","Íris"]},"unknownNotes":[],"review":"ok"}'::jsonb,
  'pendente', null, '2026-10-25T22:35:10.709Z')
  on conflict (url) do update set payload = excluded.payload, fetched_at = excluded.fetched_at where public.import_drafts.status = 'pendente';
insert into public.import_drafts (source, url, brand_slug, payload, status, perfume_id, fetched_at) values ('wikidata', 'https://www.wikidata.org/wiki/Q140003429', 'calvin-klein', '{"url":"https://www.wikidata.org/wiki/Q140003429","name":"Eternity Moment","brand":"Calvin Klein","brandName":"Calvin Klein","brandSlug":"calvin-klein","size":null,"gender":null,"year":2004,"perfumers":["Jacques Cavallier"],"sourceLabel":"Wikidata (CC0)","notesStatus":"a-confirmar","notesNote":"Pirâmide do Wikidata (base colaborativa, licença CC0). Conferir com a marca antes de publicar.","fetchedAt":"2026-10-25T22:35:10.709Z","notesEn":{"top":["lychee","raspberry","melon","guava"],"heart":["peony","jasmine","water lily"],"base":["musk","Cashmeran","sandalwood"]},"notes":{"top":["Lichia","Framboesa","Melão","Goiaba"],"heart":["Peônia","Jasmim","Ninfeia"],"base":["Almíscar","Cashmeran","Sândalo"]},"unknownNotes":[],"review":"ok"}'::jsonb,
  'pendente', null, '2026-10-25T22:35:10.709Z')
  on conflict (url) do update set payload = excluded.payload, fetched_at = excluded.fetched_at where public.import_drafts.status = 'pendente';
insert into public.import_drafts (source, url, brand_slug, payload, status, perfume_id, fetched_at) values ('wikidata', 'https://www.wikidata.org/wiki/Q3880627', 'calvin-klein', '{"url":"https://www.wikidata.org/wiki/Q3880627","name":"Obsession","brand":"Calvin Klein","brandName":"Calvin Klein","brandSlug":"calvin-klein","size":null,"gender":null,"year":1985,"perfumers":null,"sourceLabel":"Wikidata (CC0)","notesStatus":"a-confirmar","notesNote":"Pirâmide do Wikidata (base colaborativa, licença CC0). Conferir com a marca antes de publicar.","fetchedAt":"2026-10-25T22:35:10.709Z","notesEn":{"top":["vanilla","basil","bergamot","mandarin orange","peach fruit","lemon"],"heart":["spicy","sandalwood","coriander","oakmoss","cedarwood","orange blossom","jasmine","rose"],"base":["amber","incense","vanilla","civet","musk","vetiver"]},"notes":{"top":["Baunilha","Manjericão","Bergamota","Tangerina","Pêssego","Limão-siciliano"],"heart":["Notas especiadas","Sândalo","Coentro","Musgo de carvalho","Cedro","Flor de laranjeira","Jasmim","Rosa"],"base":["Âmbar","Incenso","Baunilha","Civeta","Almíscar","Vetiver"]},"unknownNotes":[],"review":"ok"}'::jsonb,
  'pendente', null, '2026-10-25T22:35:10.709Z')
  on conflict (url) do update set payload = excluded.payload, fetched_at = excluded.fetched_at where public.import_drafts.status = 'pendente';
insert into public.import_drafts (source, url, brand_slug, payload, status, perfume_id, fetched_at) values ('wikidata', 'https://www.wikidata.org/wiki/Q140018525', 'calvin-klein', '{"url":"https://www.wikidata.org/wiki/Q140018525","name":"Obsession for Men","brand":"Calvin Klein","brandName":"Calvin Klein","brandSlug":"calvin-klein","size":null,"gender":null,"year":1986,"perfumers":null,"sourceLabel":"Wikidata (CC0)","notesStatus":"a-confirmar","notesNote":"Pirâmide do Wikidata (base colaborativa, licença CC0). Conferir com a marca antes de publicar.","fetchedAt":"2026-10-25T22:35:10.710Z","notesEn":{"top":["cinnamon","lavender","coriander","mandarin orange","lime","bergamot","grapefruit"],"heart":["myrrh","nutmeg","carnation","pine resin","sage","jasmine","red berries"],"base":["amber","vanilla","sandalwood","musk","patchouli","vetiver"]},"notes":{"top":["Canela","Lavanda","Coentro","Tangerina","Limão","Bergamota","Toranja"],"heart":["Mirra","Noz-moscada","Cravo (flor)","Resinas","Sálvia","Jasmim","Frutas vermelhas"],"base":["Âmbar","Baunilha","Sândalo","Almíscar","Patchouli","Vetiver"]},"unknownNotes":[],"review":"ok"}'::jsonb,
  'pendente', null, '2026-10-25T22:35:10.710Z')
  on conflict (url) do update set payload = excluded.payload, fetched_at = excluded.fetched_at where public.import_drafts.status = 'pendente';
insert into public.import_drafts (source, url, brand_slug, payload, status, perfume_id, fetched_at) values ('wikidata', 'https://www.wikidata.org/wiki/Q3393810', 'christian-dior', '{"url":"https://www.wikidata.org/wiki/Q3393810","name":"Poison","brand":"Christian Dior","brandName":"Christian Dior","brandSlug":"christian-dior","size":null,"gender":null,"year":1985,"perfumers":null,"sourceLabel":"Wikidata (CC0)","notesStatus":"a-confirmar","notesNote":"Pirâmide do Wikidata (base colaborativa, licença CC0). Conferir com a marca antes de publicar.","fetchedAt":"2026-10-25T22:35:10.708Z","notesEn":{"top":["plum","berries","coriander","anise seed"],"heart":["tuberose","incense","honey","cinnamon","carnation","jasmine","rose"],"base":["cedarwood","vanilla","amber","sandalwood","heliotrope","musk","vetiver"]},"notes":{"top":["Ameixa","Frutas vermelhas","Coentro","Anis"],"heart":["Tuberosa","Incenso","Mel","Canela","Cravo (flor)","Jasmim","Rosa"],"base":["Cedro","Baunilha","Âmbar","Sândalo","Heliotrópio","Almíscar","Vetiver"]},"unknownNotes":[],"review":"ok"}'::jsonb,
  'pendente', null, '2026-10-25T22:35:10.708Z')
  on conflict (url) do update set payload = excluded.payload, fetched_at = excluded.fetched_at where public.import_drafts.status = 'pendente';
insert into public.import_drafts (source, url, brand_slug, payload, status, perfume_id, fetched_at) values ('wikidata', 'https://www.wikidata.org/wiki/Q140101602', 'christian-dior', '{"url":"https://www.wikidata.org/wiki/Q140101602","name":"Poison Girl","brand":"Christian Dior","brandName":"Christian Dior","brandSlug":"christian-dior","size":null,"gender":null,"year":2016,"perfumers":["François Demachy"],"sourceLabel":"Wikidata (CC0)","notesStatus":"a-confirmar","notesNote":"Pirâmide do Wikidata (base colaborativa, licença CC0). Conferir com a marca antes de publicar.","fetchedAt":"2026-10-25T22:35:10.709Z","notesEn":{"top":["bigarade","lemon"],"heart":["rose","orange blossom"],"base":["vanilla","almond","tonka bean","Tolu balsam","sandalwood","heliotrope","Cashmeran"]},"notes":{"top":["Laranja amarga","Limão-siciliano"],"heart":["Rosa","Flor de laranjeira"],"base":["Baunilha","Amêndoa","Fava-tonka","Bálsamo-de-tolu","Sândalo","Heliotrópio","Cashmeran"]},"unknownNotes":[],"review":"ok"}'::jsonb,
  'pendente', null, '2026-10-25T22:35:10.709Z')
  on conflict (url) do update set payload = excluded.payload, fetched_at = excluded.fetched_at where public.import_drafts.status = 'pendente';
insert into public.import_drafts (source, url, brand_slug, payload, status, perfume_id, fetched_at) values ('wikidata', 'https://www.wikidata.org/wiki/Q106626237', 'coty', '{"url":"https://www.wikidata.org/wiki/Q106626237","name":"Cordon Vert","brand":"Coty","brandName":"Coty","brandSlug":"coty","size":null,"gender":null,"year":1905,"perfumers":["François Coty"],"sourceLabel":"Wikidata (CC0)","notesStatus":"a-confirmar","notesNote":"Pirâmide do Wikidata (base colaborativa, licença CC0). Conferir com a marca antes de publicar.","fetchedAt":"2026-10-25T22:35:10.708Z","notesEn":{"top":["lemon","lime","mandarin orange","bergamot"],"heart":["jasmine","lavender","lemon verbena","carnation"],"base":["patchouli","oakmoss","petitgrain"]},"notes":{"top":["Limão-siciliano","Limão","Tangerina","Bergamota"],"heart":["Jasmim","Lavanda","Verbena","Cravo (flor)"],"base":["Patchouli","Musgo de carvalho","Petitgrain"]},"unknownNotes":[],"review":"ok"}'::jsonb,
  'pendente', null, '2026-10-25T22:35:10.708Z')
  on conflict (url) do update set payload = excluded.payload, fetched_at = excluded.fetched_at where public.import_drafts.status = 'pendente';
insert into public.import_drafts (source, url, brand_slug, payload, status, perfume_id, fetched_at) values ('wikidata', 'https://www.wikidata.org/wiki/Q139992070', 'creed', '{"url":"https://www.wikidata.org/wiki/Q139992070","name":"Acqua Fiorentina","brand":"Creed","brandName":"Creed","brandSlug":"creed","size":null,"gender":null,"year":2012,"perfumers":["Olivier Creed"],"sourceLabel":"Wikidata (CC0)","notesStatus":"a-confirmar","notesNote":"Pirâmide do Wikidata (base colaborativa, licença CC0). Conferir com a marca antes de publicar.","fetchedAt":"2026-10-25T22:35:10.709Z","notesEn":{"top":["grapefruit","pineapple","lemon"],"heart":["apples","rose","plum"],"base":["cedarwood","white musk"]},"notes":{"top":["Toranja","Abacaxi","Limão-siciliano"],"heart":["Maçã","Rosa","Ameixa"],"base":["Cedro","Almíscar branco"]},"unknownNotes":[],"review":"ok"}'::jsonb,
  'pendente', null, '2026-10-25T22:35:10.709Z')
  on conflict (url) do update set payload = excluded.payload, fetched_at = excluded.fetched_at where public.import_drafts.status = 'pendente';
insert into public.import_drafts (source, url, brand_slug, payload, status, perfume_id, fetched_at) values ('wikidata', 'https://www.wikidata.org/wiki/Q24886336', 'creed', '{"url":"https://www.wikidata.org/wiki/Q24886336","name":"Aventus","brand":"Creed","brandName":"Creed","brandSlug":"creed","size":null,"gender":null,"year":2010,"perfumers":null,"sourceLabel":"Wikidata (CC0)","notesStatus":"a-confirmar","notesNote":"Pirâmide do Wikidata (base colaborativa, licença CC0). Conferir com a marca antes de publicar.","fetchedAt":"2026-10-25T22:35:10.708Z","notesEn":{"top":["Calabrian bergamot","Sicilian lemon","blackcurrant leaf"],"heart":["pineapple","pink pepper","jasmine"],"base":["birch","patchouli","musk"]},"notes":{"top":["Bergamota","Limão-siciliano","Broto de cassis"],"heart":["Abacaxi","Pimenta-rosa","Jasmim"],"base":["Bétula","Patchouli","Almíscar"]},"unknownNotes":[],"review":"ok"}'::jsonb,
  'pendente', null, '2026-10-25T22:35:10.708Z')
  on conflict (url) do update set payload = excluded.payload, fetched_at = excluded.fetched_at where public.import_drafts.status = 'pendente';
insert into public.import_drafts (source, url, brand_slug, payload, status, perfume_id, fetched_at) values ('wikidata', 'https://www.wikidata.org/wiki/Q139989391', 'creed', '{"url":"https://www.wikidata.org/wiki/Q139989391","name":"Jardin d''Amalfi","brand":"Creed","brandName":"Creed","brandSlug":"creed","size":null,"gender":null,"year":2011,"perfumers":null,"sourceLabel":"Wikidata (CC0)","notesStatus":"a-confirmar","notesNote":"Pirâmide do Wikidata (base colaborativa, licença CC0). Conferir com a marca antes de publicar.","fetchedAt":"2026-10-25T22:35:10.709Z","notesEn":{"top":["pink pepper","tangerine","lemon"],"heart":["rose","jasmine","apples"],"base":["cedarwood","white musk","vetiver"]},"notes":{"top":["Pimenta-rosa","Tangerina","Limão-siciliano"],"heart":["Rosa","Jasmim","Maçã"],"base":["Cedro","Almíscar branco","Vetiver"]},"unknownNotes":[],"review":"ok"}'::jsonb,
  'pendente', null, '2026-10-25T22:35:10.709Z')
  on conflict (url) do update set payload = excluded.payload, fetched_at = excluded.fetched_at where public.import_drafts.status = 'pendente';
insert into public.import_drafts (source, url, brand_slug, payload, status, perfume_id, fetched_at) values ('wikidata', 'https://www.wikidata.org/wiki/Q3689944', 'davidoff', '{"url":"https://www.wikidata.org/wiki/Q3689944","name":"Cool Water","brand":"Davidoff","brandName":"Davidoff","brandSlug":"davidoff","size":null,"gender":null,"year":null,"perfumers":["Pierre Bourdon"],"sourceLabel":"Wikidata (CC0)","notesStatus":"a-confirmar","notesNote":"Pirâmide do Wikidata (base colaborativa, licença CC0). Conferir com a marca antes de publicar.","fetchedAt":"2026-10-25T22:35:10.707Z","notesEn":{"top":["sea","lavender","mint","green notes","Salvia rosmarinus","methyl benzodioxepinone","coriander"],"heart":["sandalwood","neroli","geranium","jasmine"],"base":["musk","oakmoss","cedarwood","tobacco","ambergris"]},"notes":{"top":["Notas marinhas","Lavanda","Menta","Notas verdes","Alecrim","Calone","Coentro"],"heart":["Sândalo","Neroli","Gerânio","Jasmim"],"base":["Almíscar","Musgo de carvalho","Cedro","Tabaco","Âmbar-gris"]},"unknownNotes":[],"review":"ok"}'::jsonb,
  'pendente', null, '2026-10-25T22:35:10.707Z')
  on conflict (url) do update set payload = excluded.payload, fetched_at = excluded.fetched_at where public.import_drafts.status = 'pendente';
insert into public.import_drafts (source, url, brand_slug, payload, status, perfume_id, fetched_at) values ('wikidata', 'https://www.wikidata.org/wiki/Q141641341', 'dolce-gabbana', '{"url":"https://www.wikidata.org/wiki/Q141641341","name":"Lemon","brand":"Dolce & Gabbana","brandName":"Dolce & Gabbana","brandSlug":"dolce-gabbana","size":null,"gender":null,"year":2020,"perfumers":["Jérôme Epinette"],"sourceLabel":"Wikidata (CC0)","notesStatus":"a-confirmar","notesNote":"Pirâmide do Wikidata (base colaborativa, licença CC0). Conferir com a marca antes de publicar.","fetchedAt":"2026-10-25T22:35:10.710Z","notesEn":{"top":["Calabrian bergamot","petitgrain","Sicilian lemon"],"heart":["ginger"],"base":["Haitian vetiver"]},"notes":{"top":["Bergamota","Petitgrain","Limão-siciliano"],"heart":["Gengibre"],"base":["Vetiver"]},"unknownNotes":[],"review":"ok"}'::jsonb,
  'pendente', null, '2026-10-25T22:35:10.710Z')
  on conflict (url) do update set payload = excluded.payload, fetched_at = excluded.fetched_at where public.import_drafts.status = 'pendente';
insert into public.import_drafts (source, url, brand_slug, payload, status, perfume_id, fetched_at) values ('wikidata', 'https://www.wikidata.org/wiki/Q141641013', 'dolce-gabbana', '{"url":"https://www.wikidata.org/wiki/Q141641013","name":"Pineapple","brand":"Dolce & Gabbana","brandName":"Dolce & Gabbana","brandSlug":"dolce-gabbana","size":null,"gender":null,"year":2020,"perfumers":["Marie Salamagne"],"sourceLabel":"Wikidata (CC0)","notesStatus":"a-confirmar","notesNote":"Pirâmide do Wikidata (base colaborativa, licença CC0). Conferir com a marca antes de publicar.","fetchedAt":"2026-10-25T22:35:10.710Z","notesEn":{"top":["pineapple","Sicilian mandarin orange"],"heart":["Jasminum sambac"],"base":["moss","amber","vanilla absolute","orchid"]},"notes":{"top":["Abacaxi","Tangerina"],"heart":["Jasmim sambac"],"base":["Musgo","Âmbar","Baunilha","Orquídea"]},"unknownNotes":[],"review":"ok"}'::jsonb,
  'pendente', null, '2026-10-25T22:35:10.710Z')
  on conflict (url) do update set payload = excluded.payload, fetched_at = excluded.fetched_at where public.import_drafts.status = 'pendente';
insert into public.import_drafts (source, url, brand_slug, payload, status, perfume_id, fetched_at) values ('wikidata', 'https://www.wikidata.org/wiki/Q140611048', 'eauso-vert', '{"url":"https://www.wikidata.org/wiki/Q140611048","name":"Vanilla Embers","brand":"Eauso Vert","brandName":"Eauso Vert","brandSlug":"eauso-vert","size":null,"gender":null,"year":2022,"perfumers":["Pascal Gaurin"],"sourceLabel":"Wikidata (CC0)","notesStatus":"a-confirmar","notesNote":"Pirâmide do Wikidata (base colaborativa, licença CC0). Conferir com a marca antes de publicar.","fetchedAt":"2026-10-25T22:35:10.710Z","notesEn":{"top":["cardamom","Aquaflora"],"heart":["jasmine","Moroccan orange blossom"],"base":["sandalwood","turmeric","vanilla"]},"notes":{"top":["Cardamomo","Notas aquáticas"],"heart":["Jasmim","Flor de laranjeira"],"base":["Sândalo","Cúrcuma","Baunilha"]},"unknownNotes":[],"review":"ok"}'::jsonb,
  'pendente', null, '2026-10-25T22:35:10.710Z')
  on conflict (url) do update set payload = excluded.payload, fetched_at = excluded.fetched_at where public.import_drafts.status = 'pendente';
insert into public.import_drafts (source, url, brand_slug, payload, status, perfume_id, fetched_at) values ('wikidata', 'https://www.wikidata.org/wiki/Q137971189', 'ffern', '{"url":"https://www.wikidata.org/wiki/Q137971189","name":"Autumn 25","brand":"Ffern","brandName":"Ffern","brandSlug":"ffern","size":null,"gender":null,"year":2025,"perfumers":["Elodie Durande"],"sourceLabel":"Wikidata (CC0)","notesStatus":"a-confirmar","notesNote":"Pirâmide do Wikidata (base colaborativa, licença CC0). Conferir com a marca antes de publicar.","fetchedAt":"2026-10-25T22:35:10.710Z","notesEn":{"top":["pink pepper","petitgrain","ginger","apples","lemon","pear","Matricaria chamomilla","cognac","frankincense","peppermint"],"heart":["neroli","ylang-ylang","tuberose","bergamot","camphorwood"],"base":["jasmine","Abelmoschus moschatus","benzoin","oakmoss","rose","Juniperus virginiana"]},"notes":{"top":["Pimenta-rosa","Petitgrain","Gengibre","Maçã","Limão-siciliano","Pera","Camomila","Conhaque","Olíbano","Hortelã-pimenta"],"heart":["Neroli","Ylang-ylang","Tuberosa","Bergamota","Cânfora"],"base":["Jasmim","Ambreta","Benjoim","Musgo de carvalho","Rosa","Cedro"]},"unknownNotes":[],"review":"ok"}'::jsonb,
  'pendente', null, '2026-10-25T22:35:10.710Z')
  on conflict (url) do update set payload = excluded.payload, fetched_at = excluded.fetched_at where public.import_drafts.status = 'pendente';
insert into public.import_drafts (source, url, brand_slug, payload, status, perfume_id, fetched_at) values ('wikidata', 'https://www.wikidata.org/wiki/Q139901743', 'ffern', '{"url":"https://www.wikidata.org/wiki/Q139901743","name":"Spring 26","brand":"Ffern","brandName":"Ffern","brandSlug":"ffern","size":null,"gender":null,"year":2026,"perfumers":["Elodie Durande"],"sourceLabel":"Wikidata (CC0)","notesStatus":"a-confirmar","notesNote":"Pirâmide do Wikidata (base colaborativa, licença CC0). Conferir com a marca antes de publicar.","fetchedAt":"2026-10-25T22:35:10.709Z","notesEn":{"top":["bigarade","petitgrain","Matricaria chamomilla","ginger","lemon","elemi","pepper","cognac","Zanthoxylum armatum"],"heart":["neroli","tuberose","bergamot","Valeriana officinalis","Rosa × centifolia","camphorwood"],"base":["orange blossom","Cytisus scoparius","cedarwood"]},"notes":{"top":["Laranja amarga","Petitgrain","Camomila","Gengibre","Limão-siciliano","Elemi","Pimenta","Conhaque","Baga timur"],"heart":["Neroli","Tuberosa","Bergamota","Valeriana","Rosa centifólia","Cânfora"],"base":["Flor de laranjeira","Giesta","Cedro"]},"unknownNotes":[],"review":"ok"}'::jsonb,
  'pendente', null, '2026-10-25T22:35:10.709Z')
  on conflict (url) do update set payload = excluded.payload, fetched_at = excluded.fetched_at where public.import_drafts.status = 'pendente';
insert into public.import_drafts (source, url, brand_slug, payload, status, perfume_id, fetched_at) values ('wikidata', 'https://www.wikidata.org/wiki/Q137912111', 'ffern', '{"url":"https://www.wikidata.org/wiki/Q137912111","name":"Winter 26","brand":"Ffern","brandName":"Ffern","brandSlug":"ffern","size":null,"gender":null,"year":2025,"perfumers":["Elodie Durande"],"sourceLabel":"Wikidata (CC0)","notesStatus":"a-confirmar","notesNote":"Pirâmide do Wikidata (base colaborativa, licença CC0). Conferir com a marca antes de publicar.","fetchedAt":"2026-10-25T22:35:10.709Z","notesEn":{"top":["lemon","peppermint","Citrus sinensis","Sichuan pepper"],"heart":["bergamot","violet leaf","eucalyptus","cloves","cardamom","basil","patchouli","Acacia dealbata","marjoram"],"base":["algal","Abies balsamea","oakmoss","lavender","sandalwood","Jasminum sambac","Juniperus virginiana","vetiver"]},"notes":{"top":["Limão-siciliano","Hortelã-pimenta","Laranja","Pimenta de Sichuan"],"heart":["Bergamota","Folha de violeta","Eucalipto","Cravo-da-índia","Cardamomo","Manjericão","Patchouli","Mimosa","Manjerona"],"base":["Notas marinhas","Bálsamo de abeto","Musgo de carvalho","Lavanda","Sândalo","Jasmim sambac","Cedro","Vetiver"]},"unknownNotes":[],"review":"ok"}'::jsonb,
  'pendente', null, '2026-10-25T22:35:10.709Z')
  on conflict (url) do update set payload = excluded.payload, fetched_at = excluded.fetched_at where public.import_drafts.status = 'pendente';
insert into public.import_drafts (source, url, brand_slug, payload, status, perfume_id, fetched_at) values ('wikidata', 'https://www.wikidata.org/wiki/Q138297662', 'future-society', '{"url":"https://www.wikidata.org/wiki/Q138297662","name":"Solar Canopy","brand":"Future Society","brandName":"Future Society","brandSlug":"future-society","size":null,"gender":null,"year":null,"perfumers":null,"sourceLabel":"Wikidata (CC0)","notesStatus":"a-confirmar","notesNote":"Pirâmide do Wikidata (base colaborativa, licença CC0). Conferir com a marca antes de publicar.","fetchedAt":"2026-10-25T22:35:10.710Z","notesEn":{"top":["bergamot","red currant","pink pepper"],"heart":["Turkish rose","lychee","pistachio","magnolia flowers"],"base":["vetiver","ambroxan","sugar"]},"notes":{"top":["Bergamota","Groselha","Pimenta-rosa"],"heart":["Rosa turca","Lichia","Pistache","Magnólia"],"base":["Vetiver","Ambroxan","Açúcar"]},"unknownNotes":[],"review":"ok"}'::jsonb,
  'pendente', null, '2026-10-25T22:35:10.710Z')
  on conflict (url) do update set payload = excluded.payload, fetched_at = excluded.fetched_at where public.import_drafts.status = 'pendente';
insert into public.import_drafts (source, url, brand_slug, payload, status, perfume_id, fetched_at) values ('wikidata', 'https://www.wikidata.org/wiki/Q106761672', 'fzotic', '{"url":"https://www.wikidata.org/wiki/Q106761672","name":"Lampblack","brand":"FZOTIC","brandName":"FZOTIC","brandSlug":"fzotic","size":null,"gender":null,"year":2013,"perfumers":["Bruno Fazzolari"],"sourceLabel":"Wikidata (CC0)","notesStatus":"a-confirmar","notesNote":"Pirâmide do Wikidata (base colaborativa, licença CC0). Conferir com a marca antes de publicar.","fetchedAt":"2026-10-25T22:35:10.708Z","notesEn":{"top":["black pepper","orange"],"heart":["grapefruit"],"base":["nagarmotha","vetiver","benzoin"]},"notes":{"top":["Pimenta-preta","Laranja"],"heart":["Toranja"],"base":["Cypriol","Vetiver","Benjoim"]},"unknownNotes":[],"review":"ok"}'::jsonb,
  'pendente', null, '2026-10-25T22:35:10.708Z')
  on conflict (url) do update set payload = excluded.payload, fetched_at = excluded.fetched_at where public.import_drafts.status = 'pendente';
insert into public.import_drafts (source, url, brand_slug, payload, status, perfume_id, fetched_at) values ('wikidata', 'https://www.wikidata.org/wiki/Q137183849', 'giardini-di-toscana', '{"url":"https://www.wikidata.org/wiki/Q137183849","name":"Bianco Latte","brand":"Giardini di Toscana","brandName":"Giardini di Toscana","brandSlug":"giardini-di-toscana","size":null,"gender":"Feminino","year":2023,"perfumers":["Silvia Martinelli"],"sourceLabel":"Wikidata (CC0)","notesStatus":"a-confirmar","notesNote":"Pirâmide do Wikidata (base colaborativa, licença CC0). Conferir com a marca antes de publicar.","fetchedAt":"2026-10-25T22:35:10.708Z","notesEn":{"top":["caramel"],"heart":["coumarin","honey"],"base":["vanilla","white musk"]},"notes":{"top":["Caramelo"],"heart":["Cumarina","Mel"],"base":["Baunilha","Almíscar branco"]},"unknownNotes":[],"review":"ok"}'::jsonb,
  'pendente', null, '2026-10-25T22:35:10.708Z')
  on conflict (url) do update set payload = excluded.payload, fetched_at = excluded.fetched_at where public.import_drafts.status = 'pendente';
insert into public.import_drafts (source, url, brand_slug, payload, status, perfume_id, fetched_at) values ('wikidata', 'https://www.wikidata.org/wiki/Q3613652', 'givenchy', '{"url":"https://www.wikidata.org/wiki/Q3613652","name":"Amarige","brand":"Givenchy","brandName":"Givenchy","brandSlug":"givenchy","size":null,"gender":null,"year":1991,"perfumers":null,"sourceLabel":"Wikidata (CC0)","notesStatus":"a-confirmar","notesNote":"Pirâmide do Wikidata (base colaborativa, licença CC0). Conferir com a marca antes de publicar.","fetchedAt":"2026-10-25T22:35:10.708Z","notesEn":{"top":["orange blossom","peach","plum"],"heart":[],"base":[]},"notes":{"top":["Flor de laranjeira","Pêssego","Ameixa"],"heart":[],"base":[]},"unknownNotes":[],"review":"ok"}'::jsonb,
  'pendente', null, '2026-10-25T22:35:10.708Z')
  on conflict (url) do update set payload = excluded.payload, fetched_at = excluded.fetched_at where public.import_drafts.status = 'pendente';
insert into public.import_drafts (source, url, brand_slug, payload, status, perfume_id, fetched_at) values ('wikidata', 'https://www.wikidata.org/wiki/Q17560895', 'givenchy', '{"url":"https://www.wikidata.org/wiki/Q17560895","name":"Ysatis","brand":"Givenchy","brandName":"Givenchy","brandSlug":"givenchy","size":null,"gender":null,"year":1984,"perfumers":null,"sourceLabel":"Wikidata (CC0)","notesStatus":"a-confirmar","notesNote":"Pirâmide do Wikidata (base colaborativa, licença CC0). Conferir com a marca antes de publicar.","fetchedAt":"2026-10-25T22:35:10.708Z","notesEn":{"top":["ylang-ylang","aldehydes","orange blossom","galbanum","coconut","bergamot","mandarin orange","citrus"],"heart":["tuberose","jasmine","narcissus flowers","carnation","rum","iris","rose"],"base":["honey","civet","oakmoss","sandalwood","cloves","amber","patchouli","musk","vetiver","vanilla"]},"notes":{"top":["Ylang-ylang","Aldeídos","Flor de laranjeira","galbano","Coco","Bergamota","Tangerina","Notas cítricas"],"heart":["Tuberosa","Jasmim","Narciso","Cravo (flor)","Rum","Íris","Rosa"],"base":["Mel","Civeta","Musgo de carvalho","Sândalo","Cravo-da-índia","Âmbar","Patchouli","Almíscar","Vetiver","Baunilha"]},"unknownNotes":[],"review":"ok"}'::jsonb,
  'pendente', null, '2026-10-25T22:35:10.708Z')
  on conflict (url) do update set payload = excluded.payload, fetched_at = excluded.fetched_at where public.import_drafts.status = 'pendente';
insert into public.import_drafts (source, url, brand_slug, payload, status, perfume_id, fetched_at) values ('wikidata', 'https://www.wikidata.org/wiki/Q138313741', 'gritti', '{"url":"https://www.wikidata.org/wiki/Q138313741","name":"Because I''m Free","brand":"Gritti","brandName":"Gritti","brandSlug":"gritti","size":null,"gender":null,"year":2023,"perfumers":null,"sourceLabel":"Wikidata (CC0)","notesStatus":"a-confirmar","notesNote":"Pirâmide do Wikidata (base colaborativa, licença CC0). Conferir com a marca antes de publicar.","fetchedAt":"2026-10-25T22:35:10.710Z","notesEn":{"top":["candied fruit","petitgrain","almond blossom"],"heart":["jasmine","tuberose","banana blossom"],"base":["amber","caramel","vanilla"]},"notes":{"top":["Notas frutadas","Petitgrain","Flor de amendoeira"],"heart":["Jasmim","Tuberosa","Flor de bananeira"],"base":["Âmbar","Caramelo","Baunilha"]},"unknownNotes":[],"review":"ok"}'::jsonb,
  'pendente', null, '2026-10-25T22:35:10.710Z')
  on conflict (url) do update set payload = excluded.payload, fetched_at = excluded.fetched_at where public.import_drafts.status = 'pendente';
insert into public.import_drafts (source, url, brand_slug, payload, status, perfume_id, fetched_at) values ('wikidata', 'https://www.wikidata.org/wiki/Q138605631', 'guerlain', '{"url":"https://www.wikidata.org/wiki/Q138605631","name":"Tobacco Honey","brand":"Guerlain","brandName":"Guerlain","brandSlug":"guerlain","size":null,"gender":null,"year":2023,"perfumers":null,"sourceLabel":"Wikidata (CC0)","notesStatus":"a-confirmar","notesNote":"Pirâmide do Wikidata (base colaborativa, licença CC0). Conferir com a marca antes de publicar.","fetchedAt":"2026-10-25T22:35:10.708Z","notesEn":{"top":["honey","cloves","anise seed"],"heart":["tobacco","vanilla","tonka bean","sesame"],"base":["oud","sandalwood"]},"notes":{"top":["Mel","Cravo-da-índia","Anis"],"heart":["Tabaco","Baunilha","Fava-tonka","Gergelim"],"base":["Oud","Sândalo"]},"unknownNotes":[],"review":"ok"}'::jsonb,
  'pendente', null, '2026-10-25T22:35:10.708Z')
  on conflict (url) do update set payload = excluded.payload, fetched_at = excluded.fetched_at where public.import_drafts.status = 'pendente';
insert into public.import_drafts (source, url, brand_slug, payload, status, perfume_id, fetched_at) values ('wikidata', 'https://www.wikidata.org/wiki/Q21233661', 'hermes', '{"url":"https://www.wikidata.org/wiki/Q21233661","name":"Terre d''Hermès","brand":"Hermès","brandName":"Hermès","brandSlug":"hermes","size":null,"gender":null,"year":null,"perfumers":null,"sourceLabel":"Wikidata (CC0)","notesStatus":"a-confirmar","notesNote":"Pirâmide do Wikidata (base colaborativa, licença CC0). Conferir com a marca antes de publicar.","fetchedAt":"2026-10-25T22:35:10.708Z","notesEn":{"top":["orange","grapefruit"],"heart":["pepper","pelargonium","flint"],"base":["vetiver","cedarwood","patchouli","benzoin"]},"notes":{"top":["Laranja","Toranja"],"heart":["Pimenta","Gerânio","Pederneira"],"base":["Vetiver","Cedro","Patchouli","Benjoim"]},"unknownNotes":[],"review":"ok"}'::jsonb,
  'pendente', null, '2026-10-25T22:35:10.708Z')
  on conflict (url) do update set payload = excluded.payload, fetched_at = excluded.fetched_at where public.import_drafts.status = 'pendente';
insert into public.import_drafts (source, url, brand_slug, payload, status, perfume_id, fetched_at) values ('wikidata', 'https://www.wikidata.org/wiki/Q137184064', 'histoires-de-parfums', '{"url":"https://www.wikidata.org/wiki/Q137184064","name":"1969","brand":"Histoires de Parfums","brandName":"Histoires de Parfums","brandSlug":"histoires-de-parfums","size":null,"gender":null,"year":2001,"perfumers":null,"sourceLabel":"Wikidata (CC0)","notesStatus":"a-confirmar","notesNote":"Pirâmide do Wikidata (base colaborativa, licença CC0). Conferir com a marca antes de publicar.","fetchedAt":"2026-10-25T22:35:10.709Z","notesEn":{"top":["peach fruit"],"heart":["cardamom","cloves","rose","white flowers"],"base":["dark chocolate","patchouli","coffee","musk"]},"notes":{"top":["Pêssego"],"heart":["Cardamomo","Cravo-da-índia","Rosa","Flores brancas"],"base":["Chocolate","Patchouli","Café","Almíscar"]},"unknownNotes":[],"review":"ok"}'::jsonb,
  'pendente', null, '2026-10-25T22:35:10.709Z')
  on conflict (url) do update set payload = excluded.payload, fetched_at = excluded.fetched_at where public.import_drafts.status = 'pendente';
insert into public.import_drafts (source, url, brand_slug, payload, status, perfume_id, fetched_at) values ('wikidata', 'https://www.wikidata.org/wiki/Q140237028', 'jovoy', '{"url":"https://www.wikidata.org/wiki/Q140237028","name":"Ha Long Bay","brand":"Jovoy","brandName":"Jovoy","brandSlug":"jovoy","size":null,"gender":null,"year":2025,"perfumers":null,"sourceLabel":"Wikidata (CC0)","notesStatus":"a-confirmar","notesNote":"Pirâmide do Wikidata (base colaborativa, licença CC0). Conferir com a marca antes de publicar.","fetchedAt":"2026-10-25T22:35:10.710Z","notesEn":{"top":["mango","cardamom","black pepper"],"heart":["leather","cedarwood","nagarmotha"],"base":["amberwood","patchouli","orcanox"]},"notes":{"top":["Manga","Cardamomo","Pimenta-preta"],"heart":["Couro","Cedro","Cypriol"],"base":["Amberwood","Patchouli","Âmbar-gris"]},"unknownNotes":[],"review":"ok"}'::jsonb,
  'pendente', null, '2026-10-25T22:35:10.710Z')
  on conflict (url) do update set payload = excluded.payload, fetched_at = excluded.fetched_at where public.import_drafts.status = 'pendente';
insert into public.import_drafts (source, url, brand_slug, payload, status, perfume_id, fetched_at) values ('wikidata', 'https://www.wikidata.org/wiki/Q141099119', 'juliette-has-a-gun', '{"url":"https://www.wikidata.org/wiki/Q141099119","name":"Banana Rush","brand":"Juliette Has a Gun","brandName":"Juliette Has a Gun","brandSlug":"juliette-has-a-gun","size":null,"gender":null,"year":2026,"perfumers":null,"sourceLabel":"Wikidata (CC0)","notesStatus":"a-confirmar","notesNote":"Pirâmide do Wikidata (base colaborativa, licença CC0). Conferir com a marca antes de publicar.","fetchedAt":"2026-10-25T22:35:10.710Z","notesEn":{"top":["banana","maple syrup"],"heart":["coconut","frangipani"],"base":["vanilla","sandalwood"]},"notes":{"top":["Banana","Xarope de bordo"],"heart":["Coco","Frangipani"],"base":["Baunilha","Sândalo"]},"unknownNotes":[],"review":"ok"}'::jsonb,
  'pendente', null, '2026-10-25T22:35:10.710Z')
  on conflict (url) do update set payload = excluded.payload, fetched_at = excluded.fetched_at where public.import_drafts.status = 'pendente';
insert into public.import_drafts (source, url, brand_slug, payload, status, perfume_id, fetched_at) values ('wikidata', 'https://www.wikidata.org/wiki/Q141098533', 'juliette-has-a-gun', '{"url":"https://www.wikidata.org/wiki/Q141098533","name":"Pear Inc.","brand":"Juliette Has a Gun","brandName":"Juliette Has a Gun","brandSlug":"juliette-has-a-gun","size":null,"gender":"Feminino","year":2021,"perfumers":["Romano Ricci"],"sourceLabel":"Wikidata (CC0)","notesStatus":"a-confirmar","notesNote":"Pirâmide do Wikidata (base colaborativa, licença CC0). Conferir com a marca antes de publicar.","fetchedAt":"2026-10-25T22:35:10.710Z","notesEn":{"top":["green pear"],"heart":["ambroxan"],"base":["musk","ambrettolide"]},"notes":{"top":["Pera"],"heart":["Ambroxan"],"base":["Almíscar","Ambreta"]},"unknownNotes":[],"review":"ok"}'::jsonb,
  'pendente', null, '2026-10-25T22:35:10.710Z')
  on conflict (url) do update set payload = excluded.payload, fetched_at = excluded.fetched_at where public.import_drafts.status = 'pendente';
insert into public.import_drafts (source, url, brand_slug, payload, status, perfume_id, fetched_at) values ('wikidata', 'https://www.wikidata.org/wiki/Q141490815', 'karakash', '{"url":"https://www.wikidata.org/wiki/Q141490815","name":"Zamira","brand":"Karakash","brandName":"Karakash","brandSlug":"karakash","size":null,"gender":null,"year":null,"perfumers":["Mohammad Tammam Mando"],"sourceLabel":"Wikidata (CC0)","notesStatus":"a-confirmar","notesNote":"Pirâmide do Wikidata (base colaborativa, licença CC0). Conferir com a marca antes de publicar.","fetchedAt":"2026-10-25T22:35:10.710Z","notesEn":{"top":["mandarin orange","galbanum","akigalawood","saffron","raspberry"],"heart":["Chinese osmanthus","violet leaf","blackcurrant","musk","vanilla"],"base":["sandalwood","passionfruit","patchouli","pear","sand"]},"notes":{"top":["Tangerina","galbano","Akigalawood","Açafrão","Framboesa"],"heart":["Osmanto","Folha de violeta","Cassis","Almíscar","Baunilha"],"base":["Sândalo","Maracujá","Patchouli","Pera","Notas minerais"]},"unknownNotes":[],"review":"ok"}'::jsonb,
  'pendente', null, '2026-10-25T22:35:10.710Z')
  on conflict (url) do update set payload = excluded.payload, fetched_at = excluded.fetched_at where public.import_drafts.status = 'pendente';
insert into public.import_drafts (source, url, brand_slug, payload, status, perfume_id, fetched_at) values ('wikidata', 'https://www.wikidata.org/wiki/Q137361933', 'maison-crivelli', '{"url":"https://www.wikidata.org/wiki/Q137361933","name":"Cuir InfraRouge","brand":"Maison Crivelli","brandName":"Maison Crivelli","brandSlug":"maison-crivelli","size":null,"gender":null,"year":2024,"perfumers":null,"sourceLabel":"Wikidata (CC0)","notesStatus":"a-confirmar","notesNote":"Pirâmide do Wikidata (base colaborativa, licença CC0). Conferir com a marca antes de publicar.","fetchedAt":"2026-10-25T22:35:10.709Z","notesEn":{"top":["raspberry","cinnamon","bergamot"],"heart":["orris root","osmanthus","cedarwood"],"base":["leather","oud","vanilla","patchouli"]},"notes":{"top":["Framboesa","Canela","Bergamota"],"heart":["Íris","Osmanto","Cedro"],"base":["Couro","Oud","Baunilha","Patchouli"]},"unknownNotes":[],"review":"ok"}'::jsonb,
  'pendente', null, '2026-10-25T22:35:10.709Z')
  on conflict (url) do update set payload = excluded.payload, fetched_at = excluded.fetched_at where public.import_drafts.status = 'pendente';
insert into public.import_drafts (source, url, brand_slug, payload, status, perfume_id, fetched_at) values ('wikidata', 'https://www.wikidata.org/wiki/Q137581884', 'maison-crivelli', '{"url":"https://www.wikidata.org/wiki/Q137581884","name":"Safran Secret","brand":"Maison Crivelli","brandName":"Maison Crivelli","brandSlug":"maison-crivelli","size":null,"gender":null,"year":2022,"perfumers":null,"sourceLabel":"Wikidata (CC0)","notesStatus":"a-confirmar","notesNote":"Pirâmide do Wikidata (base colaborativa, licença CC0). Conferir com a marca antes de publicar.","fetchedAt":"2026-10-25T22:35:10.709Z","notesEn":{"top":["spicy"],"heart":["saffron"],"base":["blonde wood"]},"notes":{"top":["Notas especiadas"],"heart":["Açafrão"],"base":["Notas amadeiradas"]},"unknownNotes":[],"review":"ok"}'::jsonb,
  'pendente', null, '2026-10-25T22:35:10.709Z')
  on conflict (url) do update set payload = excluded.payload, fetched_at = excluded.fetched_at where public.import_drafts.status = 'pendente';
insert into public.import_drafts (source, url, brand_slug, payload, status, perfume_id, fetched_at) values ('wikidata', 'https://www.wikidata.org/wiki/Q141775669', 'malin-goetz', '{"url":"https://www.wikidata.org/wiki/Q141775669","name":"Dark Rum (2014)","brand":"Malin+Goetz","brandName":"Malin+Goetz","brandSlug":"malin-goetz","size":null,"gender":null,"year":2014,"perfumers":null,"sourceLabel":"Wikidata (CC0)","notesStatus":"a-confirmar","notesNote":"Pirâmide do Wikidata (base colaborativa, licença CC0). Conferir com a marca antes de publicar.","fetchedAt":"2026-10-25T22:35:10.710Z","notesEn":{"top":["plum","bergamot"],"heart":["rum","leather"],"base":["amber","milk","patchouli"]},"notes":{"top":["Ameixa","Bergamota"],"heart":["Rum","Couro"],"base":["Âmbar","Leite","Patchouli"]},"unknownNotes":[],"review":"ok"}'::jsonb,
  'pendente', null, '2026-10-25T22:35:10.710Z')
  on conflict (url) do update set payload = excluded.payload, fetched_at = excluded.fetched_at where public.import_drafts.status = 'pendente';
insert into public.import_drafts (source, url, brand_slug, payload, status, perfume_id, fetched_at) values ('wikidata', 'https://www.wikidata.org/wiki/Q141775618', 'malin-goetz', '{"url":"https://www.wikidata.org/wiki/Q141775618","name":"Dark Rum (2017)","brand":"Malin+Goetz","brandName":"Malin+Goetz","brandSlug":"malin-goetz","size":null,"gender":null,"year":2017,"perfumers":null,"sourceLabel":"Wikidata (CC0)","notesStatus":"a-confirmar","notesNote":"Pirâmide do Wikidata (base colaborativa, licença CC0). Conferir com a marca antes de publicar.","fetchedAt":"2026-10-25T22:35:10.710Z","notesEn":{"top":["bergamot","plum"],"heart":["leather","rum","vanilla"],"base":["patchouli","amber","milk"]},"notes":{"top":["Bergamota","Ameixa"],"heart":["Couro","Rum","Baunilha"],"base":["Patchouli","Âmbar","Leite"]},"unknownNotes":[],"review":"ok"}'::jsonb,
  'pendente', null, '2026-10-25T22:35:10.710Z')
  on conflict (url) do update set payload = excluded.payload, fetched_at = excluded.fetched_at where public.import_drafts.status = 'pendente';
insert into public.import_drafts (source, url, brand_slug, payload, status, perfume_id, fetched_at) values ('wikidata', 'https://www.wikidata.org/wiki/Q137213178', 'mancera', '{"url":"https://www.wikidata.org/wiki/Q137213178","name":"Tonka Cola","brand":"Mancera","brandName":"Mancera","brandSlug":"mancera","size":null,"gender":null,"year":null,"perfumers":null,"sourceLabel":"Wikidata (CC0)","notesStatus":"a-confirmar","notesNote":"Pirâmide do Wikidata (base colaborativa, licença CC0). Conferir com a marca antes de publicar.","fetchedAt":"2026-10-25T22:35:10.709Z","notesEn":{"top":["Sicilian lemon","nutmeg","cinnamon","black cherry"],"heart":["cola","patchouli","orange blossom"],"base":["tonka bean","benzoin","labdanum","vanilla"]},"notes":{"top":["Limão-siciliano","Noz-moscada","Canela","Cereja-negra"],"heart":["Cola","Patchouli","Flor de laranjeira"],"base":["Fava-tonka","Benjoim","Ládano","Baunilha"]},"unknownNotes":[],"review":"ok"}'::jsonb,
  'pendente', null, '2026-10-25T22:35:10.709Z')
  on conflict (url) do update set payload = excluded.payload, fetched_at = excluded.fetched_at where public.import_drafts.status = 'pendente';
insert into public.import_drafts (source, url, brand_slug, payload, status, perfume_id, fetched_at) values ('wikidata', 'https://www.wikidata.org/wiki/Q110263664', 'marc-jacobs', '{"url":"https://www.wikidata.org/wiki/Q110263664","name":"Daisy","brand":"Marc Jacobs","brandName":"Marc Jacobs","brandSlug":"marc-jacobs","size":null,"gender":"Feminino","year":2007,"perfumers":["Alberto Morillas"],"sourceLabel":"Wikidata (CC0)","notesStatus":"a-confirmar","notesNote":"Pirâmide do Wikidata (base colaborativa, licença CC0). Conferir com a marca antes de publicar.","fetchedAt":"2026-10-25T22:35:10.708Z","notesEn":{"top":["violet leaf","blood grapefruit","strawberry"],"heart":["violets","gardenia","jasmine"],"base":["musk","woody","vanilla"]},"notes":{"top":["Folha de violeta","Toranja","Morango"],"heart":["Violeta","Gardênia","Jasmim"],"base":["Almíscar","Notas amadeiradas","Baunilha"]},"unknownNotes":[],"review":"ok"}'::jsonb,
  'pendente', null, '2026-10-25T22:35:10.708Z')
  on conflict (url) do update set payload = excluded.payload, fetched_at = excluded.fetched_at where public.import_drafts.status = 'pendente';
insert into public.import_drafts (source, url, brand_slug, payload, status, perfume_id, fetched_at) values ('wikidata', 'https://www.wikidata.org/wiki/Q137825310', 'marc-antoine-barrois', '{"url":"https://www.wikidata.org/wiki/Q137825310","name":"Ganymede","brand":"Marc-Antoine Barrois","brandName":"Marc-Antoine Barrois","brandSlug":"marc-antoine-barrois","size":null,"gender":null,"year":2019,"perfumers":null,"sourceLabel":"Wikidata (CC0)","notesStatus":"a-confirmar","notesNote":"Pirâmide do Wikidata (base colaborativa, licença CC0). Conferir com a marca antes de publicar.","fetchedAt":"2026-10-25T22:35:10.709Z","notesEn":{"top":["saffron","mandarin orange"],"heart":["osmanthus","violet leaf","immortelle"],"base":["mineral","suede","akigalawood","musk","cedarwood","patchouli","immortelle"]},"notes":{"top":["Açafrão","Tangerina"],"heart":["Osmanto","Folha de violeta","Imortela"],"base":["Notas minerais","Camurça","Akigalawood","Almíscar","Cedro","Patchouli","Imortela"]},"unknownNotes":[],"review":"ok"}'::jsonb,
  'pendente', null, '2026-10-25T22:35:10.709Z')
  on conflict (url) do update set payload = excluded.payload, fetched_at = excluded.fetched_at where public.import_drafts.status = 'pendente';
insert into public.import_drafts (source, url, brand_slug, payload, status, perfume_id, fetched_at) values ('wikidata', 'https://www.wikidata.org/wiki/Q140298435', 'memo-paris', '{"url":"https://www.wikidata.org/wiki/Q140298435","name":"Odéon","brand":"Memo Paris","brandName":"Memo Paris","brandSlug":"memo-paris","size":null,"gender":null,"year":2020,"perfumers":null,"sourceLabel":"Wikidata (CC0)","notesStatus":"a-confirmar","notesNote":"Pirâmide do Wikidata (base colaborativa, licença CC0). Conferir com a marca antes de publicar.","fetchedAt":"2026-10-25T22:35:10.710Z","notesEn":{"top":["rose absolute","candied rose"],"heart":["sandalwood","Cashmeran","patchouli"],"base":["tonka bean absolute","amber","musk"]},"notes":{"top":["Rosa","Rosa"],"heart":["Sândalo","Cashmeran","Patchouli"],"base":["Fava-tonka","Âmbar","Almíscar"]},"unknownNotes":[],"review":"ok"}'::jsonb,
  'pendente', null, '2026-10-25T22:35:10.710Z')
  on conflict (url) do update set payload = excluded.payload, fetched_at = excluded.fetched_at where public.import_drafts.status = 'pendente';
insert into public.import_drafts (source, url, brand_slug, payload, status, perfume_id, fetched_at) values ('wikidata', 'https://www.wikidata.org/wiki/Q137183811', 'mind-games', '{"url":"https://www.wikidata.org/wiki/Q137183811","name":"Counterplay","brand":"Mind Games","brandName":"Mind Games","brandSlug":"mind-games","size":null,"gender":null,"year":2024,"perfumers":["Christelle Laprade"],"sourceLabel":"Wikidata (CC0)","notesStatus":"a-confirmar","notesNote":"Pirâmide do Wikidata (base colaborativa, licença CC0). Conferir com a marca antes de publicar.","fetchedAt":"2026-10-25T22:35:10.708Z","notesEn":{"top":["melon","guava","banana"],"heart":["osmanthus","ylang-ylang","orange blossom"],"base":["patchouli","sandalwood","pink pepper"]},"notes":{"top":["Melão","Goiaba","Banana"],"heart":["Osmanto","Ylang-ylang","Flor de laranjeira"],"base":["Patchouli","Sândalo","Pimenta-rosa"]},"unknownNotes":[],"review":"ok"}'::jsonb,
  'pendente', null, '2026-10-25T22:35:10.708Z')
  on conflict (url) do update set payload = excluded.payload, fetched_at = excluded.fetched_at where public.import_drafts.status = 'pendente';
insert into public.import_drafts (source, url, brand_slug, payload, status, perfume_id, fetched_at) values ('wikidata', 'https://www.wikidata.org/wiki/Q140078542', 'mugler', '{"url":"https://www.wikidata.org/wiki/Q140078542","name":"Alien","brand":"Mugler","brandName":"Mugler","brandSlug":"mugler","size":null,"gender":null,"year":2005,"perfumers":["Dominique Ropion"],"sourceLabel":"Wikidata (CC0)","notesStatus":"a-confirmar","notesNote":"Pirâmide do Wikidata (base colaborativa, licença CC0). Conferir com a marca antes de publicar.","fetchedAt":"2026-10-25T22:35:10.710Z","notesEn":{"top":["Jasminum sambac"],"heart":["Cashmeran"],"base":["amber"]},"notes":{"top":["Jasmim sambac"],"heart":["Cashmeran"],"base":["Âmbar"]},"unknownNotes":[],"review":"ok"}'::jsonb,
  'pendente', null, '2026-10-25T22:35:10.710Z')
  on conflict (url) do update set payload = excluded.payload, fetched_at = excluded.fetched_at where public.import_drafts.status = 'pendente';
insert into public.import_drafts (source, url, brand_slug, payload, status, perfume_id, fetched_at) values ('wikidata', 'https://www.wikidata.org/wiki/Q140078574', 'mugler', '{"url":"https://www.wikidata.org/wiki/Q140078574","name":"Alien Eau de Toilette","brand":"Mugler","brandName":"Mugler","brandSlug":"mugler","size":null,"gender":null,"year":2009,"perfumers":null,"sourceLabel":"Wikidata (CC0)","notesStatus":"a-confirmar","notesNote":"Pirâmide do Wikidata (base colaborativa, licença CC0). Conferir com a marca antes de publicar.","fetchedAt":"2026-10-25T22:35:10.710Z","notesEn":{"top":["citrus","mandarin orange"],"heart":["jasmine","white flowers"],"base":["amber","Cashmeran"]},"notes":{"top":["Notas cítricas","Tangerina"],"heart":["Jasmim","Flores brancas"],"base":["Âmbar","Cashmeran"]},"unknownNotes":[],"review":"ok"}'::jsonb,
  'pendente', null, '2026-10-25T22:35:10.710Z')
  on conflict (url) do update set payload = excluded.payload, fetched_at = excluded.fetched_at where public.import_drafts.status = 'pendente';
insert into public.import_drafts (source, url, brand_slug, payload, status, perfume_id, fetched_at) values ('wikidata', 'https://www.wikidata.org/wiki/Q140084520', 'mugler', '{"url":"https://www.wikidata.org/wiki/Q140084520","name":"Alien Eau Extraordinaire","brand":"Mugler","brandName":"Mugler","brandSlug":"mugler","size":null,"gender":null,"year":2014,"perfumers":["Dominique Ropion"],"sourceLabel":"Wikidata (CC0)","notesStatus":"a-confirmar","notesNote":"Pirâmide do Wikidata (base colaborativa, licença CC0). Conferir com a marca antes de publicar.","fetchedAt":"2026-10-25T22:35:10.709Z","notesEn":{"top":["bergamot","tea","neroli","lemon","lime","orange"],"heart":["tiaré","orange blossom","heliotrope","pepper","ylang-ylang"],"base":["amber","Cashmeran","vanilla","sandalwood","white musk"]},"notes":{"top":["Bergamota","Chá","Neroli","Limão-siciliano","Limão","Laranja"],"heart":["Flor de tiaré","Flor de laranjeira","Heliotrópio","Pimenta","Ylang-ylang"],"base":["Âmbar","Cashmeran","Baunilha","Sândalo","Almíscar branco"]},"unknownNotes":[],"review":"ok"}'::jsonb,
  'pendente', null, '2026-10-25T22:35:10.709Z')
  on conflict (url) do update set payload = excluded.payload, fetched_at = excluded.fetched_at where public.import_drafts.status = 'pendente';
insert into public.import_drafts (source, url, brand_slug, payload, status, perfume_id, fetched_at) values ('wikidata', 'https://www.wikidata.org/wiki/Q140078914', 'mugler', '{"url":"https://www.wikidata.org/wiki/Q140078914","name":"Alien Essence Absolue","brand":"Mugler","brandName":"Mugler","brandSlug":"mugler","size":null,"gender":null,"year":2012,"perfumers":null,"sourceLabel":"Wikidata (CC0)","notesStatus":"a-confirmar","notesNote":"Pirâmide do Wikidata (base colaborativa, licença CC0). Conferir com a marca antes de publicar.","fetchedAt":"2026-10-25T22:35:10.709Z","notesEn":{"top":["jasmine"],"heart":["orris root"],"base":["vanilla","amber","myrrh","incense"]},"notes":{"top":["Jasmim"],"heart":["Íris"],"base":["Baunilha","Âmbar","Mirra","Incenso"]},"unknownNotes":[],"review":"ok"}'::jsonb,
  'pendente', null, '2026-10-25T22:35:10.709Z')
  on conflict (url) do update set payload = excluded.payload, fetched_at = excluded.fetched_at where public.import_drafts.status = 'pendente';
insert into public.import_drafts (source, url, brand_slug, payload, status, perfume_id, fetched_at) values ('wikidata', 'https://www.wikidata.org/wiki/Q140078941', 'mugler', '{"url":"https://www.wikidata.org/wiki/Q140078941","name":"Alien Flora Futura","brand":"Mugler","brandName":"Mugler","brandSlug":"mugler","size":null,"gender":null,"year":2018,"perfumers":["Dominique Ropion","Jean-Christophe Hérault"],"sourceLabel":"Wikidata (CC0)","notesStatus":"a-confirmar","notesNote":"Pirâmide do Wikidata (base colaborativa, licença CC0). Conferir com a marca antes de publicar.","fetchedAt":"2026-10-25T22:35:10.709Z","notesEn":{"top":["Buddha''s hand"],"heart":[],"base":["amber","sandalwood"]},"notes":{"top":["Cidra"],"heart":[],"base":["Âmbar","Sândalo"]},"unknownNotes":[],"review":"ok"}'::jsonb,
  'pendente', null, '2026-10-25T22:35:10.709Z')
  on conflict (url) do update set payload = excluded.payload, fetched_at = excluded.fetched_at where public.import_drafts.status = 'pendente';
insert into public.import_drafts (source, url, brand_slug, payload, status, perfume_id, fetched_at) values ('wikidata', 'https://www.wikidata.org/wiki/Q140084447', 'mugler', '{"url":"https://www.wikidata.org/wiki/Q140084447","name":"Alien Fusion","brand":"Mugler","brandName":"Mugler","brandSlug":"mugler","size":null,"gender":null,"year":2019,"perfumers":["Dominique Ropion"],"sourceLabel":"Wikidata (CC0)","notesStatus":"a-confirmar","notesNote":"Pirâmide do Wikidata (base colaborativa, licença CC0). Conferir com a marca antes de publicar.","fetchedAt":"2026-10-25T22:35:10.709Z","notesEn":{"top":["ginger","cinnamon"],"heart":["orange blossom","tuberose"],"base":["amber","vanilla"]},"notes":{"top":["Gengibre","Canela"],"heart":["Flor de laranjeira","Tuberosa"],"base":["Âmbar","Baunilha"]},"unknownNotes":[],"review":"ok"}'::jsonb,
  'pendente', null, '2026-10-25T22:35:10.709Z')
  on conflict (url) do update set payload = excluded.payload, fetched_at = excluded.fetched_at where public.import_drafts.status = 'pendente';
insert into public.import_drafts (source, url, brand_slug, payload, status, perfume_id, fetched_at) values ('wikidata', 'https://www.wikidata.org/wiki/Q140078650', 'mugler', '{"url":"https://www.wikidata.org/wiki/Q140078650","name":"Alien Goddess","brand":"Mugler","brandName":"Mugler","brandSlug":"mugler","size":null,"gender":null,"year":2021,"perfumers":["Nathalie Lorson"],"sourceLabel":"Wikidata (CC0)","notesStatus":"a-confirmar","notesNote":"Pirâmide do Wikidata (base colaborativa, licença CC0). Conferir com a marca antes de publicar.","fetchedAt":"2026-10-25T22:35:10.710Z","notesEn":{"top":["coconut","bergamot"],"heart":["jasmine","heliotrope"],"base":["vanilla","Cashmeran"]},"notes":{"top":["Coco","Bergamota"],"heart":["Jasmim","Heliotrópio"],"base":["Baunilha","Cashmeran"]},"unknownNotes":[],"review":"ok"}'::jsonb,
  'pendente', null, '2026-10-25T22:35:10.710Z')
  on conflict (url) do update set payload = excluded.payload, fetched_at = excluded.fetched_at where public.import_drafts.status = 'pendente';
insert into public.import_drafts (source, url, brand_slug, payload, status, perfume_id, fetched_at) values ('wikidata', 'https://www.wikidata.org/wiki/Q140078747', 'mugler', '{"url":"https://www.wikidata.org/wiki/Q140078747","name":"Alien Goddess Intense","brand":"Mugler","brandName":"Mugler","brandSlug":"mugler","size":null,"gender":null,"year":2022,"perfumers":["Nathalie Lorson"],"sourceLabel":"Wikidata (CC0)","notesStatus":"a-confirmar","notesNote":"Pirâmide do Wikidata (base colaborativa, licença CC0). Conferir com a marca antes de publicar.","fetchedAt":"2026-10-25T22:35:10.709Z","notesEn":{"top":["coconut","bergamot"],"heart":["jasmine"],"base":["vanilla","benzoin"]},"notes":{"top":["Coco","Bergamota"],"heart":["Jasmim"],"base":["Baunilha","Benjoim"]},"unknownNotes":[],"review":"ok"}'::jsonb,
  'pendente', null, '2026-10-25T22:35:10.709Z')
  on conflict (url) do update set payload = excluded.payload, fetched_at = excluded.fetched_at where public.import_drafts.status = 'pendente';
insert into public.import_drafts (source, url, brand_slug, payload, status, perfume_id, fetched_at) values ('wikidata', 'https://www.wikidata.org/wiki/Q140078802', 'mugler', '{"url":"https://www.wikidata.org/wiki/Q140078802","name":"Alien Goddess Supra Florale","brand":"Mugler","brandName":"Mugler","brandSlug":"mugler","size":null,"gender":null,"year":2023,"perfumers":["Nathalie Lorson"],"sourceLabel":"Wikidata (CC0)","notesStatus":"a-confirmar","notesNote":"Pirâmide do Wikidata (base colaborativa, licença CC0). Conferir com a marca antes de publicar.","fetchedAt":"2026-10-25T22:35:10.709Z","notesEn":{"top":[],"heart":["Jasminum sambac","immortelle"],"base":["amber","musk"]},"notes":{"top":[],"heart":["Jasmim sambac","Imortela"],"base":["Âmbar","Almíscar"]},"unknownNotes":[],"review":"ok"}'::jsonb,
  'pendente', null, '2026-10-25T22:35:10.709Z')
  on conflict (url) do update set payload = excluded.payload, fetched_at = excluded.fetched_at where public.import_drafts.status = 'pendente';
insert into public.import_drafts (source, url, brand_slug, payload, status, perfume_id, fetched_at) values ('wikidata', 'https://www.wikidata.org/wiki/Q140078826', 'mugler', '{"url":"https://www.wikidata.org/wiki/Q140078826","name":"Alien Hypersense","brand":"Mugler","brandName":"Mugler","brandSlug":"mugler","size":null,"gender":null,"year":2024,"perfumers":["Dominique Ropion"],"sourceLabel":"Wikidata (CC0)","notesStatus":"a-confirmar","notesNote":"Pirâmide do Wikidata (base colaborativa, licença CC0). Conferir com a marca antes de publicar.","fetchedAt":"2026-10-25T22:35:10.709Z","notesEn":{"top":["pear"],"heart":["Jasminum sambac","jasmine"],"base":["Cashmeran","musk","driftwood"]},"notes":{"top":["Pera"],"heart":["Jasmim sambac","Jasmim"],"base":["Cashmeran","Almíscar","Notas amadeiradas"]},"unknownNotes":[],"review":"ok"}'::jsonb,
  'pendente', null, '2026-10-25T22:35:10.709Z')
  on conflict (url) do update set payload = excluded.payload, fetched_at = excluded.fetched_at where public.import_drafts.status = 'pendente';
insert into public.import_drafts (source, url, brand_slug, payload, status, perfume_id, fetched_at) values ('wikidata', 'https://www.wikidata.org/wiki/Q140078599', 'mugler', '{"url":"https://www.wikidata.org/wiki/Q140078599","name":"Alien Man","brand":"Mugler","brandName":"Mugler","brandSlug":"mugler","size":null,"gender":null,"year":2018,"perfumers":["Jean-Christophe Hérault"],"sourceLabel":"Wikidata (CC0)","notesStatus":"a-confirmar","notesNote":"Pirâmide do Wikidata (base colaborativa, licença CC0). Conferir com a marca antes de publicar.","fetchedAt":"2026-10-25T22:35:10.710Z","notesEn":{"top":["anise seed","mint","lavender","thyme","lemon"],"heart":["leather","osmanthus","pepper","geranium"],"base":["amber","Cashmeran","vanilla"]},"notes":{"top":["Anis","Menta","Lavanda","Tomilho","Limão-siciliano"],"heart":["Couro","Osmanto","Pimenta","Gerânio"],"base":["Âmbar","Cashmeran","Baunilha"]},"unknownNotes":[],"review":"ok"}'::jsonb,
  'pendente', null, '2026-10-25T22:35:10.710Z')
  on conflict (url) do update set payload = excluded.payload, fetched_at = excluded.fetched_at where public.import_drafts.status = 'pendente';
insert into public.import_drafts (source, url, brand_slug, payload, status, perfume_id, fetched_at) values ('wikidata', 'https://www.wikidata.org/wiki/Q140084488', 'mugler', '{"url":"https://www.wikidata.org/wiki/Q140084488","name":"Alien Man Fusion","brand":"Mugler","brandName":"Mugler","brandSlug":"mugler","size":null,"gender":null,"year":2019,"perfumers":null,"sourceLabel":"Wikidata (CC0)","notesStatus":"a-confirmar","notesNote":"Pirâmide do Wikidata (base colaborativa, licença CC0). Conferir com a marca antes de publicar.","fetchedAt":"2026-10-25T22:35:10.709Z","notesEn":{"top":["ginger","cinnamon"],"heart":["osmanthus","leather"],"base":["coffee"]},"notes":{"top":["Gengibre","Canela"],"heart":["Osmanto","Couro"],"base":["Café"]},"unknownNotes":[],"review":"ok"}'::jsonb,
  'pendente', null, '2026-10-25T22:35:10.709Z')
  on conflict (url) do update set payload = excluded.payload, fetched_at = excluded.fetched_at where public.import_drafts.status = 'pendente';
insert into public.import_drafts (source, url, brand_slug, payload, status, perfume_id, fetched_at) values ('wikidata', 'https://www.wikidata.org/wiki/Q140080065', 'mugler', '{"url":"https://www.wikidata.org/wiki/Q140080065","name":"Alien Man Mirage","brand":"Mugler","brandName":"Mugler","brandSlug":"mugler","size":null,"gender":null,"year":2020,"perfumers":null,"sourceLabel":"Wikidata (CC0)","notesStatus":"a-confirmar","notesNote":"Pirâmide do Wikidata (base colaborativa, licença CC0). Conferir com a marca antes de publicar.","fetchedAt":"2026-10-25T22:35:10.709Z","notesEn":{"top":["mineral","juniper"],"heart":[],"base":["patchouli","leather"]},"notes":{"top":["Notas minerais","Zimbro"],"heart":[],"base":["Patchouli","Couro"]},"unknownNotes":[],"review":"ok"}'::jsonb,
  'pendente', null, '2026-10-25T22:35:10.709Z')
  on conflict (url) do update set payload = excluded.payload, fetched_at = excluded.fetched_at where public.import_drafts.status = 'pendente';
insert into public.import_drafts (source, url, brand_slug, payload, status, perfume_id, fetched_at) values ('wikidata', 'https://www.wikidata.org/wiki/Q140079365', 'mugler', '{"url":"https://www.wikidata.org/wiki/Q140079365","name":"Alien Mirage","brand":"Mugler","brandName":"Mugler","brandSlug":"mugler","size":null,"gender":null,"year":2020,"perfumers":["Dominique Ropion"],"sourceLabel":"Wikidata (CC0)","notesStatus":"a-confirmar","notesNote":"Pirâmide do Wikidata (base colaborativa, licença CC0). Conferir com a marca antes de publicar.","fetchedAt":"2026-10-25T22:35:10.709Z","notesEn":{"top":["mineral","pink pepper"],"heart":["Syringa"],"base":["amber"]},"notes":{"top":["Notas minerais","Pimenta-rosa"],"heart":["Lilás"],"base":["Âmbar"]},"unknownNotes":[],"review":"ok"}'::jsonb,
  'pendente', null, '2026-10-25T22:35:10.709Z')
  on conflict (url) do update set payload = excluded.payload, fetched_at = excluded.fetched_at where public.import_drafts.status = 'pendente';
insert into public.import_drafts (source, url, brand_slug, payload, status, perfume_id, fetched_at) values ('wikidata', 'https://www.wikidata.org/wiki/Q140083800', 'mugler', '{"url":"https://www.wikidata.org/wiki/Q140083800","name":"Alien Musc Mysterieux","brand":"Mugler","brandName":"Mugler","brandSlug":"mugler","size":null,"gender":null,"year":2017,"perfumers":["Dominique Ropion"],"sourceLabel":"Wikidata (CC0)","notesStatus":"a-confirmar","notesNote":"Pirâmide do Wikidata (base colaborativa, licença CC0). Conferir com a marca antes de publicar.","fetchedAt":"2026-10-25T22:35:10.709Z","notesEn":{"top":["spicy","saffron"],"heart":["Jasminum sambac","Cashmeran"],"base":["white musk","vanilla"]},"notes":{"top":["Notas especiadas","Açafrão"],"heart":["Jasmim sambac","Cashmeran"],"base":["Almíscar branco","Baunilha"]},"unknownNotes":[],"review":"ok"}'::jsonb,
  'pendente', null, '2026-10-25T22:35:10.709Z')
  on conflict (url) do update set payload = excluded.payload, fetched_at = excluded.fetched_at where public.import_drafts.status = 'pendente';
insert into public.import_drafts (source, url, brand_slug, payload, status, perfume_id, fetched_at) values ('wikidata', 'https://www.wikidata.org/wiki/Q140078884', 'mugler', '{"url":"https://www.wikidata.org/wiki/Q140078884","name":"Alien Pulp","brand":"Mugler","brandName":"Mugler","brandSlug":"mugler","size":null,"gender":null,"year":2025,"perfumers":["Dominique Ropion"],"sourceLabel":"Wikidata (CC0)","notesStatus":"a-confirmar","notesNote":"Pirâmide do Wikidata (base colaborativa, licença CC0). Conferir com a marca antes de publicar.","fetchedAt":"2026-10-25T22:35:10.709Z","notesEn":{"top":["raspberry"],"heart":["jasmine","mandarin orange","orange"],"base":["musk","Cashmeran"]},"notes":{"top":["Framboesa"],"heart":["Jasmim","Tangerina","Laranja"],"base":["Almíscar","Cashmeran"]},"unknownNotes":[],"review":"ok"}'::jsonb,
  'pendente', null, '2026-10-25T22:35:10.709Z')
  on conflict (url) do update set payload = excluded.payload, fetched_at = excluded.fetched_at where public.import_drafts.status = 'pendente';
insert into public.import_drafts (source, url, brand_slug, payload, status, perfume_id, fetched_at) values ('wikidata', 'https://www.wikidata.org/wiki/Q139990105', 'mugler', '{"url":"https://www.wikidata.org/wiki/Q139990105","name":"Angel Elixir","brand":"Mugler","brandName":"Mugler","brandSlug":"mugler","size":null,"gender":null,"year":2023,"perfumers":["Anne Flipo"],"sourceLabel":"Wikidata (CC0)","notesStatus":"a-confirmar","notesNote":"Pirâmide do Wikidata (base colaborativa, licença CC0). Conferir com a marca antes de publicar.","fetchedAt":"2026-10-25T22:35:10.709Z","notesEn":{"top":["pink pepper"],"heart":["jasmine","ylang-ylang","sandalwood","orange blossom"],"base":["vanilla","amber"]},"notes":{"top":["Pimenta-rosa"],"heart":["Jasmim","Ylang-ylang","Sândalo","Flor de laranjeira"],"base":["Baunilha","Âmbar"]},"unknownNotes":[],"review":"ok"}'::jsonb,
  'pendente', null, '2026-10-25T22:35:10.709Z')
  on conflict (url) do update set payload = excluded.payload, fetched_at = excluded.fetched_at where public.import_drafts.status = 'pendente';
insert into public.import_drafts (source, url, brand_slug, payload, status, perfume_id, fetched_at) values ('wikidata', 'https://www.wikidata.org/wiki/Q139989992', 'mugler', '{"url":"https://www.wikidata.org/wiki/Q139989992","name":"Angel Fantasm","brand":"Mugler","brandName":"Mugler","brandSlug":"mugler","size":null,"gender":"Feminino","year":2024,"perfumers":null,"sourceLabel":"Wikidata (CC0)","notesStatus":"a-confirmar","notesNote":"Pirâmide do Wikidata (base colaborativa, licença CC0). Conferir com a marca antes de publicar.","fetchedAt":"2026-10-25T22:35:10.709Z","notesEn":{"top":["pineapple","bergamot"],"heart":["coconut","tiaré"],"base":["patchouli","vanilla","amber"]},"notes":{"top":["Abacaxi","Bergamota"],"heart":["Coco","Flor de tiaré"],"base":["Patchouli","Baunilha","Âmbar"]},"unknownNotes":[],"review":"ok"}'::jsonb,
  'pendente', null, '2026-10-25T22:35:10.709Z')
  on conflict (url) do update set payload = excluded.payload, fetched_at = excluded.fetched_at where public.import_drafts.status = 'pendente';
insert into public.import_drafts (source, url, brand_slug, payload, status, perfume_id, fetched_at) values ('wikidata', 'https://www.wikidata.org/wiki/Q139980728', 'mugler', '{"url":"https://www.wikidata.org/wiki/Q139980728","name":"Angel Muse (2016)","brand":"Mugler","brandName":"Mugler","brandSlug":"mugler","size":null,"gender":null,"year":2016,"perfumers":["Quentin Bisch"],"sourceLabel":"Wikidata (CC0)","notesStatus":"a-confirmar","notesNote":"Pirâmide do Wikidata (base colaborativa, licença CC0). Conferir com a marca antes de publicar.","fetchedAt":"2026-10-25T22:35:10.709Z","notesEn":{"top":["pink pepper","grapefruit"],"heart":[],"base":["patchouli","vetiver"]},"notes":{"top":["Pimenta-rosa","Toranja"],"heart":[],"base":["Patchouli","Vetiver"]},"unknownNotes":[],"review":"ok"}'::jsonb,
  'pendente', null, '2026-10-25T22:35:10.709Z')
  on conflict (url) do update set payload = excluded.payload, fetched_at = excluded.fetched_at where public.import_drafts.status = 'pendente';
insert into public.import_drafts (source, url, brand_slug, payload, status, perfume_id, fetched_at) values ('wikidata', 'https://www.wikidata.org/wiki/Q139980849', 'mugler', '{"url":"https://www.wikidata.org/wiki/Q139980849","name":"Angel Muse (2017)","brand":"Mugler","brandName":"Mugler","brandSlug":"mugler","size":null,"gender":null,"year":2017,"perfumers":["Quentin Bisch"],"sourceLabel":"Wikidata (CC0)","notesStatus":"a-confirmar","notesNote":"Pirâmide do Wikidata (base colaborativa, licença CC0). Conferir com a marca antes de publicar.","fetchedAt":"2026-10-25T22:35:10.709Z","notesEn":{"top":["passionfruit","mandarin orange","lemon"],"heart":[],"base":["vetiver","chocolate","akigalawood","caramel"]},"notes":{"top":["Maracujá","Tangerina","Limão-siciliano"],"heart":[],"base":["Vetiver","Chocolate","Akigalawood","Caramelo"]},"unknownNotes":[],"review":"ok"}'::jsonb,
  'pendente', null, '2026-10-25T22:35:10.709Z')
  on conflict (url) do update set payload = excluded.payload, fetched_at = excluded.fetched_at where public.import_drafts.status = 'pendente';
insert into public.import_drafts (source, url, brand_slug, payload, status, perfume_id, fetched_at) values ('wikidata', 'https://www.wikidata.org/wiki/Q139980194', 'mugler', '{"url":"https://www.wikidata.org/wiki/Q139980194","name":"Angel Nova (2020)","brand":"Mugler","brandName":"Mugler","brandSlug":"mugler","size":null,"gender":null,"year":2020,"perfumers":["Sonia Constant","Quentin Bisch"],"sourceLabel":"Wikidata (CC0)","notesStatus":"a-confirmar","notesNote":"Pirâmide do Wikidata (base colaborativa, licença CC0). Conferir com a marca antes de publicar.","fetchedAt":"2026-10-25T22:35:10.709Z","notesEn":{"top":["raspberry","lychee"],"heart":["rose"],"base":["akigalawood","benzoin"]},"notes":{"top":["Framboesa","Lichia"],"heart":["Rosa"],"base":["Akigalawood","Benjoim"]},"unknownNotes":[],"review":"ok"}'::jsonb,
  'pendente', null, '2026-10-25T22:35:10.709Z')
  on conflict (url) do update set payload = excluded.payload, fetched_at = excluded.fetched_at where public.import_drafts.status = 'pendente';
insert into public.import_drafts (source, url, brand_slug, payload, status, perfume_id, fetched_at) values ('wikidata', 'https://www.wikidata.org/wiki/Q139980332', 'mugler', '{"url":"https://www.wikidata.org/wiki/Q139980332","name":"Angel Nova (2021)","brand":"Mugler","brandName":"Mugler","brandSlug":"mugler","size":null,"gender":null,"year":2021,"perfumers":["Sonia Constant","Quentin Bisch"],"sourceLabel":"Wikidata (CC0)","notesStatus":"a-confirmar","notesNote":"Pirâmide do Wikidata (base colaborativa, licença CC0). Conferir com a marca antes de publicar.","fetchedAt":"2026-10-25T22:35:10.709Z","notesEn":{"top":["lychee","bergamot"],"heart":["rose","magnolia flowers"],"base":["musk","Virginia cedarwood"]},"notes":{"top":["Lichia","Bergamota"],"heart":["Rosa","Magnólia"],"base":["Almíscar","Cedro"]},"unknownNotes":[],"review":"ok"}'::jsonb,
  'pendente', null, '2026-10-25T22:35:10.709Z')
  on conflict (url) do update set payload = excluded.payload, fetched_at = excluded.fetched_at where public.import_drafts.status = 'pendente';
insert into public.import_drafts (source, url, brand_slug, payload, status, perfume_id, fetched_at) values ('wikidata', 'https://www.wikidata.org/wiki/Q139989688', 'mugler', '{"url":"https://www.wikidata.org/wiki/Q139989688","name":"Angel Stellar","brand":"Mugler","brandName":"Mugler","brandSlug":"mugler","size":null,"gender":"Feminino","year":2025,"perfumers":null,"sourceLabel":"Wikidata (CC0)","notesStatus":"a-confirmar","notesNote":"Pirâmide do Wikidata (base colaborativa, licença CC0). Conferir com a marca antes de publicar.","fetchedAt":"2026-10-25T22:35:10.709Z","notesEn":{"top":["bergamot"],"heart":["pistachio"],"base":["patchouli"]},"notes":{"top":["Bergamota"],"heart":["Pistache"],"base":["Patchouli"]},"unknownNotes":[],"review":"ok"}'::jsonb,
  'pendente', null, '2026-10-25T22:35:10.709Z')
  on conflict (url) do update set payload = excluded.payload, fetched_at = excluded.fetched_at where public.import_drafts.status = 'pendente';
insert into public.import_drafts (source, url, brand_slug, payload, status, perfume_id, fetched_at) values ('wikidata', 'https://www.wikidata.org/wiki/Q140084579', 'mugler', '{"url":"https://www.wikidata.org/wiki/Q140084579","name":"Show","brand":"Mugler","brandName":"Mugler","brandSlug":"mugler","size":null,"gender":null,"year":2013,"perfumers":null,"sourceLabel":"Wikidata (CC0)","notesStatus":"a-confirmar","notesNote":"Pirâmide do Wikidata (base colaborativa, licença CC0). Conferir com a marca antes de publicar.","fetchedAt":"2026-10-25T22:35:10.709Z","notesEn":{"top":["bergamot"],"heart":["magnolia flowers"],"base":["white musk"]},"notes":{"top":["Bergamota"],"heart":["Magnólia"],"base":["Almíscar branco"]},"unknownNotes":[],"review":"ok"}'::jsonb,
  'pendente', null, '2026-10-25T22:35:10.709Z')
  on conflict (url) do update set payload = excluded.payload, fetched_at = excluded.fetched_at where public.import_drafts.status = 'pendente';
insert into public.import_drafts (source, url, brand_slug, payload, status, perfume_id, fetched_at) values ('wikidata', 'https://www.wikidata.org/wiki/Q138773649', 'navitus-parfums', '{"url":"https://www.wikidata.org/wiki/Q138773649","name":"Virtus","brand":"Navitus Parfums","brandName":"Navitus Parfums","brandSlug":"navitus-parfums","size":null,"gender":null,"year":2019,"perfumers":["Bertrand Duchaufour"],"sourceLabel":"Wikidata (CC0)","notesStatus":"a-confirmar","notesNote":"Pirâmide do Wikidata (base colaborativa, licença CC0). Conferir com a marca antes de publicar.","fetchedAt":"2026-10-25T22:35:10.709Z","notesEn":{"top":["bergamot","cardamom","davana","nutmeg","saffron"],"heart":["honey","beeswax absolute","mango","fig milk","cinnamon","clary sage"],"base":["tobacco","patchouli","vanilla","labdanum absolute","musk","ambergris","benzoin","driftwood"]},"notes":{"top":["Bergamota","Cardamomo","Davana","Noz-moscada","Açafrão"],"heart":["Mel","Cera de abelha","Manga","Figo","Leite","Canela","Sálvia-esclareia"],"base":["Tabaco","Patchouli","Baunilha","Ládano","Almíscar","Âmbar-gris","Benjoim","Notas amadeiradas"]},"unknownNotes":[],"review":"ok"}'::jsonb,
  'pendente', null, '2026-10-25T22:35:10.709Z')
  on conflict (url) do update set payload = excluded.payload, fetched_at = excluded.fetched_at where public.import_drafts.status = 'pendente';
insert into public.import_drafts (source, url, brand_slug, payload, status, perfume_id, fetched_at) values ('wikidata', 'https://www.wikidata.org/wiki/Q138034992', 'neil-morris-fragrances', '{"url":"https://www.wikidata.org/wiki/Q138034992","name":"Zephyr","brand":"Neil Morris Fragrances","brandName":"Neil Morris Fragrances","brandSlug":"neil-morris-fragrances","size":null,"gender":null,"year":null,"perfumers":null,"sourceLabel":"Wikidata (CC0)","notesStatus":"a-confirmar","notesNote":"Pirâmide do Wikidata (base colaborativa, licença CC0). Conferir com a marca antes de publicar.","fetchedAt":"2026-10-25T22:35:10.710Z","notesEn":{"top":["papaya fruit","tangerine"],"heart":["honeysuckle","Casablanca lily","white tea"],"base":["sandalwood","amber","musk"]},"notes":{"top":["Mamão","Tangerina"],"heart":["Madressilva","Lírio","Chá branco"],"base":["Sândalo","Âmbar","Almíscar"]},"unknownNotes":[],"review":"ok"}'::jsonb,
  'pendente', null, '2026-10-25T22:35:10.710Z')
  on conflict (url) do update set payload = excluded.payload, fetched_at = excluded.fetched_at where public.import_drafts.status = 'pendente';
insert into public.import_drafts (source, url, brand_slug, payload, status, perfume_id, fetched_at) values ('wikidata', 'https://www.wikidata.org/wiki/Q138867078', 'nette', '{"url":"https://www.wikidata.org/wiki/Q138867078","name":"Pear Jam","brand":"Nette","brandName":"Nette","brandSlug":"nette","size":null,"gender":null,"year":2024,"perfumers":null,"sourceLabel":"Wikidata (CC0)","notesStatus":"a-confirmar","notesNote":"Pirâmide do Wikidata (base colaborativa, licença CC0). Conferir com a marca antes de publicar.","fetchedAt":"2026-10-25T22:35:10.709Z","notesEn":{"top":["Koji pear","Calabrian bergamot","blackcurrant","raspberry"],"heart":["osmanthus","Jasminum sambac","rose water"],"base":["ambrette seed","patchouli","akigalawood","white peach"]},"notes":{"top":["Pera","Bergamota","Cassis","Framboesa"],"heart":["Osmanto","Jasmim sambac","Rosa"],"base":["Ambreta","Patchouli","Akigalawood","Pêssego"]},"unknownNotes":[],"review":"ok"}'::jsonb,
  'pendente', null, '2026-10-25T22:35:10.709Z')
  on conflict (url) do update set payload = excluded.payload, fetched_at = excluded.fetched_at where public.import_drafts.status = 'pendente';
insert into public.import_drafts (source, url, brand_slug, payload, status, perfume_id, fetched_at) values ('wikidata', 'https://www.wikidata.org/wiki/Q137454537', 'nicolai-paris', '{"url":"https://www.wikidata.org/wiki/Q137454537","name":"Patchouli Sublime","brand":"Nicolaï Paris","brandName":"Nicolaï Paris","brandSlug":"nicolai-paris","size":null,"gender":null,"year":2017,"perfumers":["Patricia de Nicolaï"],"sourceLabel":"Wikidata (CC0)","notesStatus":"a-confirmar","notesNote":"Pirâmide do Wikidata (base colaborativa, licença CC0). Conferir com a marca antes de publicar.","fetchedAt":"2026-10-25T22:35:10.709Z","notesEn":{"top":["peppermint","lavender","coriander"],"heart":["incense","geranium","rose","cloves"],"base":["patchouli","amber","musk","tobacco","tonka bean"]},"notes":{"top":["Hortelã-pimenta","Lavanda","Coentro"],"heart":["Incenso","Gerânio","Rosa","Cravo-da-índia"],"base":["Patchouli","Âmbar","Almíscar","Tabaco","Fava-tonka"]},"unknownNotes":[],"review":"ok"}'::jsonb,
  'pendente', null, '2026-10-25T22:35:10.709Z')
  on conflict (url) do update set payload = excluded.payload, fetched_at = excluded.fetched_at where public.import_drafts.status = 'pendente';
insert into public.import_drafts (source, url, brand_slug, payload, status, perfume_id, fetched_at) values ('wikidata', 'https://www.wikidata.org/wiki/Q138576966', 'nishane', '{"url":"https://www.wikidata.org/wiki/Q138576966","name":"Wūlóng Chá X","brand":"Nishane","brandName":"Nishane","brandSlug":"nishane","size":null,"gender":null,"year":2023,"perfumers":null,"sourceLabel":"Wikidata (CC0)","notesStatus":"a-confirmar","notesNote":"Pirâmide do Wikidata (base colaborativa, licença CC0). Conferir com a marca antes de publicar.","fetchedAt":"2026-10-25T22:35:10.708Z","notesEn":{"top":["bergamot","yuzu","Litsea cubeba","mandarin orange"],"heart":["magnolia flowers","thyme oil","green tea"],"base":["fig","musk"]},"notes":{"top":["Bergamota","Yuzu","Litsea","Tangerina"],"heart":["Magnólia","Tomilho","Chá verde"],"base":["Figo","Almíscar"]},"unknownNotes":[],"review":"ok"}'::jsonb,
  'pendente', null, '2026-10-25T22:35:10.708Z')
  on conflict (url) do update set payload = excluded.payload, fetched_at = excluded.fetched_at where public.import_drafts.status = 'pendente';
insert into public.import_drafts (source, url, brand_slug, payload, status, perfume_id, fetched_at) values ('wikidata', 'https://www.wikidata.org/wiki/Q140453489', 'organ-tale', '{"url":"https://www.wikidata.org/wiki/Q140453489","name":"Printemps","brand":"Organ Tale","brandName":"Organ Tale","brandSlug":"organ-tale","size":null,"gender":null,"year":2024,"perfumers":["Quentin Bisch"],"sourceLabel":"Wikidata (CC0)","notesStatus":"a-confirmar","notesNote":"Pirâmide do Wikidata (base colaborativa, licença CC0). Conferir com a marca antes de publicar.","fetchedAt":"2026-10-25T22:35:10.710Z","notesEn":{"top":["apples","peach fruit","lemon"],"heart":["lily-of-the-valley","jasmine","honey"],"base":["musk","sandalwood","transparent woods"]},"notes":{"top":["Maçã","Pêssego","Limão-siciliano"],"heart":["Lírio-do-vale","Jasmim","Mel"],"base":["Almíscar","Sândalo","Notas amadeiradas"]},"unknownNotes":[],"review":"ok"}'::jsonb,
  'pendente', null, '2026-10-25T22:35:10.710Z')
  on conflict (url) do update set payload = excluded.payload, fetched_at = excluded.fetched_at where public.import_drafts.status = 'pendente';
insert into public.import_drafts (source, url, brand_slug, payload, status, perfume_id, fetched_at) values ('wikidata', 'https://www.wikidata.org/wiki/Q139903229', 'ormonde-jayne', '{"url":"https://www.wikidata.org/wiki/Q139903229","name":"Bijou Zafran","brand":"Ormonde Jayne","brandName":"Ormonde Jayne","brandSlug":"ormonde-jayne","size":null,"gender":null,"year":2026,"perfumers":null,"sourceLabel":"Wikidata (CC0)","notesStatus":"a-confirmar","notesNote":"Pirâmide do Wikidata (base colaborativa, licença CC0). Conferir com a marca antes de publicar.","fetchedAt":"2026-10-25T22:35:10.709Z","notesEn":{"top":["saffron","pear"],"heart":["nagarmotha","iris","benzoin"],"base":["patchouli","ambroxan","musk","sandalwood"]},"notes":{"top":["Açafrão","Pera"],"heart":["Cypriol","Íris","Benjoim"],"base":["Patchouli","Ambroxan","Almíscar","Sândalo"]},"unknownNotes":[],"review":"ok"}'::jsonb,
  'pendente', null, '2026-10-25T22:35:10.709Z')
  on conflict (url) do update set payload = excluded.payload, fetched_at = excluded.fetched_at where public.import_drafts.status = 'pendente';
insert into public.import_drafts (source, url, brand_slug, payload, status, perfume_id, fetched_at) values ('wikidata', 'https://www.wikidata.org/wiki/Q141714299', 'ormonde-jayne', '{"url":"https://www.wikidata.org/wiki/Q141714299","name":"Levant","brand":"Ormonde Jayne","brandName":"Ormonde Jayne","brandSlug":"ormonde-jayne","size":null,"gender":null,"year":2020,"perfumers":null,"sourceLabel":"Wikidata (CC0)","notesStatus":"a-confirmar","notesNote":"Pirâmide do Wikidata (base colaborativa, licença CC0). Conferir com a marca antes de publicar.","fetchedAt":"2026-10-25T22:35:10.710Z","notesEn":{"top":["bergamot","mandarin orange","tangelo","rose petals"],"heart":["peony","orange blossom","lily-of-the-valley","jasmine"],"base":["cedarwood","amber","musk"]},"notes":{"top":["Bergamota","Tangerina","Tangerina","Rosa"],"heart":["Peônia","Flor de laranjeira","Lírio-do-vale","Jasmim"],"base":["Cedro","Âmbar","Almíscar"]},"unknownNotes":[],"review":"ok"}'::jsonb,
  'pendente', null, '2026-10-25T22:35:10.710Z')
  on conflict (url) do update set payload = excluded.payload, fetched_at = excluded.fetched_at where public.import_drafts.status = 'pendente';
insert into public.import_drafts (source, url, brand_slug, payload, status, perfume_id, fetched_at) values ('wikidata', 'https://www.wikidata.org/wiki/Q139250750', 'parfums-artimique', '{"url":"https://www.wikidata.org/wiki/Q139250750","name":"Jasmin Gyokuro","brand":"Parfums Artimique","brandName":"Parfums Artimique","brandSlug":"parfums-artimique","size":null,"gender":null,"year":2023,"perfumers":null,"sourceLabel":"Wikidata (CC0)","notesStatus":"a-confirmar","notesNote":"Pirâmide do Wikidata (base colaborativa, licença CC0). Conferir com a marca antes de publicar.","fetchedAt":"2026-10-25T22:35:10.709Z","notesEn":{"top":["Calabrian bergamot","green tea","Williams pear"],"heart":["jasmine","tuberose","tiaré"],"base":["Haitian vetiver","musk","angelica root"]},"notes":{"top":["Bergamota","Chá verde","Pera"],"heart":["Jasmim","Tuberosa","Flor de tiaré"],"base":["Vetiver","Almíscar","Angélica"]},"unknownNotes":[],"review":"ok"}'::jsonb,
  'pendente', null, '2026-10-25T22:35:10.709Z')
  on conflict (url) do update set payload = excluded.payload, fetched_at = excluded.fetched_at where public.import_drafts.status = 'pendente';
insert into public.import_drafts (source, url, brand_slug, payload, status, perfume_id, fetched_at) values ('wikidata', 'https://www.wikidata.org/wiki/Q137383096', 'perroy', '{"url":"https://www.wikidata.org/wiki/Q137383096","name":"Blondpurple","brand":"Perroy","brandName":"Perroy","brandSlug":"perroy","size":null,"gender":null,"year":2024,"perfumers":["Arnaud Poulain"],"sourceLabel":"Wikidata (CC0)","notesStatus":"a-confirmar","notesNote":"Pirâmide do Wikidata (base colaborativa, licença CC0). Conferir com a marca antes de publicar.","fetchedAt":"2026-10-25T22:35:10.709Z","notesEn":{"top":["mango"],"heart":["blackcurrant"],"base":["ylang-ylang"]},"notes":{"top":["Manga"],"heart":["Cassis"],"base":["Ylang-ylang"]},"unknownNotes":[],"review":"ok"}'::jsonb,
  'pendente', null, '2026-10-25T22:35:10.709Z')
  on conflict (url) do update set payload = excluded.payload, fetched_at = excluded.fetched_at where public.import_drafts.status = 'pendente';
insert into public.import_drafts (source, url, brand_slug, payload, status, perfume_id, fetched_at) values ('wikidata', 'https://www.wikidata.org/wiki/Q141442739', 'serviette', '{"url":"https://www.wikidata.org/wiki/Q141442739","name":"Byronic Hero","brand":"Serviette","brandName":"Serviette","brandSlug":"serviette","size":null,"gender":null,"year":null,"perfumers":["Trey Taylor"],"sourceLabel":"Wikidata (CC0)","notesStatus":"a-confirmar","notesNote":"Pirâmide do Wikidata (base colaborativa, licença CC0). Conferir com a marca antes de publicar.","fetchedAt":"2026-10-25T22:35:10.710Z","notesEn":{"top":["cloves","saffron"],"heart":["rose","fir balsam"],"base":["oud","patchouli","diesel exhaust"]},"notes":{"top":["Cravo-da-índia","Açafrão"],"heart":["Rosa","Bálsamo de abeto"],"base":["Oud","Patchouli","Notas defumadas"]},"unknownNotes":[],"review":"ok"}'::jsonb,
  'pendente', null, '2026-10-25T22:35:10.710Z')
  on conflict (url) do update set payload = excluded.payload, fetched_at = excluded.fetched_at where public.import_drafts.status = 'pendente';
insert into public.import_drafts (source, url, brand_slug, payload, status, perfume_id, fetched_at) values ('wikidata', 'https://www.wikidata.org/wiki/Q140075144', 'sphinx-fragrances', '{"url":"https://www.wikidata.org/wiki/Q140075144","name":"Horchata de Vanille","brand":"Sphinx Fragrances","brandName":"Sphinx Fragrances","brandSlug":"sphinx-fragrances","size":null,"gender":null,"year":2022,"perfumers":null,"sourceLabel":"Wikidata (CC0)","notesStatus":"a-confirmar","notesNote":"Pirâmide do Wikidata (base colaborativa, licença CC0). Conferir com a marca antes de publicar.","fetchedAt":"2026-10-25T22:35:10.710Z","notesEn":{"top":["cinnamon","vanilla"],"heart":["milk"],"base":["rice","horchata"]},"notes":{"top":["Canela","Baunilha"],"heart":["Leite"],"base":["Arroz","Horchata"]},"unknownNotes":[],"review":"ok"}'::jsonb,
  'pendente', null, '2026-10-25T22:35:10.710Z')
  on conflict (url) do update set payload = excluded.payload, fetched_at = excluded.fetched_at where public.import_drafts.status = 'pendente';
insert into public.import_drafts (source, url, brand_slug, payload, status, perfume_id, fetched_at) values ('wikidata', 'https://www.wikidata.org/wiki/Q137182953', 'tom-ford', '{"url":"https://www.wikidata.org/wiki/Q137182953","name":"Tom Ford for Men","brand":"Tom Ford","brandName":"Tom Ford","brandSlug":"tom-ford","size":null,"gender":"Masculino","year":null,"perfumers":["Yves Cassar"],"sourceLabel":"Wikidata (CC0)","notesStatus":"a-confirmar","notesNote":"Pirâmide do Wikidata (base colaborativa, licença CC0). Conferir com a marca antes de publicar.","fetchedAt":"2026-10-25T22:35:10.708Z","notesEn":{"top":["lemon leaf oil","ginger","mandarin orange","bergamot","basil","violet leaf"],"heart":["tobacco","pepper","orange blossom","grapefruit blossom"],"base":["amber","cedarwood","vetiver","oakmoss","patchouli","leather","nagarmotha"]},"notes":{"top":["Limão","Gengibre","Tangerina","Bergamota","Manjericão","Folha de violeta"],"heart":["Tabaco","Pimenta","Flor de laranjeira","Flor de toranja"],"base":["Âmbar","Cedro","Vetiver","Musgo de carvalho","Patchouli","Couro","Cypriol"]},"unknownNotes":[],"review":"ok"}'::jsonb,
  'pendente', null, '2026-10-25T22:35:10.708Z')
  on conflict (url) do update set payload = excluded.payload, fetched_at = excluded.fetched_at where public.import_drafts.status = 'pendente';
insert into public.import_drafts (source, url, brand_slug, payload, status, perfume_id, fetched_at) values ('wikidata', 'https://www.wikidata.org/wiki/Q141774515', 'trudon', '{"url":"https://www.wikidata.org/wiki/Q141774515","name":"45°","brand":"Trudon","brandName":"Trudon","brandSlug":"trudon","size":null,"gender":null,"year":2025,"perfumers":["Yann Vasnier"],"sourceLabel":"Wikidata (CC0)","notesStatus":"a-confirmar","notesNote":"Pirâmide do Wikidata (base colaborativa, licença CC0). Conferir com a marca antes de publicar.","fetchedAt":"2026-10-25T22:35:10.710Z","notesEn":{"top":["bergamot","honey"],"heart":["vanilla absolute","Georgywood","Madagascar vanilla"],"base":["benzoin","vanillin"]},"notes":{"top":["Bergamota","Mel"],"heart":["Baunilha","Georgywood","Baunilha de Madagascar"],"base":["Benjoim","Baunilha"]},"unknownNotes":[],"review":"ok"}'::jsonb,
  'pendente', null, '2026-10-25T22:35:10.710Z')
  on conflict (url) do update set payload = excluded.payload, fetched_at = excluded.fetched_at where public.import_drafts.status = 'pendente';
insert into public.import_drafts (source, url, brand_slug, payload, status, perfume_id, fetched_at) values ('wikidata', 'https://www.wikidata.org/wiki/Q141467134', 'une-nuit-nomade', '{"url":"https://www.wikidata.org/wiki/Q141467134","name":"Memory Motel","brand":"Une Nuit Nomade","brandName":"Une Nuit Nomade","brandSlug":"une-nuit-nomade","size":null,"gender":null,"year":2017,"perfumers":["Annick Ménardo"],"sourceLabel":"Wikidata (CC0)","notesStatus":"a-confirmar","notesNote":"Pirâmide do Wikidata (base colaborativa, licença CC0). Conferir com a marca antes de publicar.","fetchedAt":"2026-10-25T22:35:10.710Z","notesEn":{"top":["bergamot"],"heart":["fringed pink","frankincense","iris"],"base":["tobacco","patchouli","leather","vanilla","moss"]},"notes":{"top":["Bergamota"],"heart":["Cravo (flor)","Olíbano","Íris"],"base":["Tabaco","Patchouli","Couro","Baunilha","Musgo"]},"unknownNotes":[],"review":"ok"}'::jsonb,
  'pendente', null, '2026-10-25T22:35:10.710Z')
  on conflict (url) do update set payload = excluded.payload, fetched_at = excluded.fetched_at where public.import_drafts.status = 'pendente';
insert into public.import_drafts (source, url, brand_slug, payload, status, perfume_id, fetched_at) values ('wikidata', 'https://www.wikidata.org/wiki/Q140266694', 'versace', '{"url":"https://www.wikidata.org/wiki/Q140266694","name":"Crystal Noir EDT","brand":"Versace","brandName":"Versace","brandSlug":"versace","size":null,"gender":null,"year":2004,"perfumers":["Antoine Lie"],"sourceLabel":"Wikidata (CC0)","notesStatus":"a-confirmar","notesNote":"Pirâmide do Wikidata (base colaborativa, licença CC0). Conferir com a marca antes de publicar.","fetchedAt":"2026-10-25T22:35:10.710Z","notesEn":{"top":["pepper","cardamom","ginger","blackcurrant","violets"],"heart":["gardenia","orange blossom","peony","jasmine","tuberose"],"base":["sandalwood","musk","amber","Cashmeran","heliotrope","vanilla"]},"notes":{"top":["Pimenta","Cardamomo","Gengibre","Cassis","Violeta"],"heart":["Gardênia","Flor de laranjeira","Peônia","Jasmim","Tuberosa"],"base":["Sândalo","Almíscar","Âmbar","Cashmeran","Heliotrópio","Baunilha"]},"unknownNotes":[],"review":"ok"}'::jsonb,
  'pendente', null, '2026-10-25T22:35:10.710Z')
  on conflict (url) do update set payload = excluded.payload, fetched_at = excluded.fetched_at where public.import_drafts.status = 'pendente';
insert into public.import_drafts (source, url, brand_slug, payload, status, perfume_id, fetched_at) values ('wikidata', 'https://www.wikidata.org/wiki/Q137386796', 'versatile-paris', '{"url":"https://www.wikidata.org/wiki/Q137386796","name":"God Bless Cola","brand":"Versȧtile Paris","brandName":"Versȧtile Paris","brandSlug":"versatile-paris","size":null,"gender":null,"year":2023,"perfumers":["Elia Chiche","Camille Chemardin"],"sourceLabel":"Wikidata (CC0)","notesStatus":"a-confirmar","notesNote":"Pirâmide do Wikidata (base colaborativa, licença CC0). Conferir com a marca antes de publicar.","fetchedAt":"2026-10-25T22:35:10.709Z","notesEn":{"top":["popcorn","cola"],"heart":["butter","caramel","peanut"],"base":["vanilla","gourmand accord","sweet","woody"]},"notes":{"top":["Pipoca","Cola"],"heart":["Manteiga","Caramelo","Amendoim"],"base":["Baunilha","Notas gourmand","Notas doces","Notas amadeiradas"]},"unknownNotes":[],"review":"ok"}'::jsonb,
  'pendente', null, '2026-10-25T22:35:10.709Z')
  on conflict (url) do update set payload = excluded.payload, fetched_at = excluded.fetched_at where public.import_drafts.status = 'pendente';
insert into public.import_drafts (source, url, brand_slug, payload, status, perfume_id, fetched_at) values ('wikidata', 'https://www.wikidata.org/wiki/Q139990340', 'vivienne-westwood', '{"url":"https://www.wikidata.org/wiki/Q139990340","name":"Anglomania","brand":"Vivienne Westwood","brandName":"Vivienne Westwood","brandSlug":"vivienne-westwood","size":null,"gender":null,"year":2005,"perfumers":["Dominique Ropion"],"sourceLabel":"Wikidata (CC0)","notesStatus":"a-confirmar","notesNote":"Pirâmide do Wikidata (base colaborativa, licença CC0). Conferir com a marca antes de publicar.","fetchedAt":"2026-10-25T22:35:10.710Z","notesEn":{"top":["cardamom","coriander","green tea"],"heart":["rose","violets","nutmeg"],"base":["leather","amber","vanilla"]},"notes":{"top":["Cardamomo","Coentro","Chá verde"],"heart":["Rosa","Violeta","Noz-moscada"],"base":["Couro","Âmbar","Baunilha"]},"unknownNotes":[],"review":"ok"}'::jsonb,
  'pendente', null, '2026-10-25T22:35:10.710Z')
  on conflict (url) do update set payload = excluded.payload, fetched_at = excluded.fetched_at where public.import_drafts.status = 'pendente';
insert into public.import_drafts (source, url, brand_slug, payload, status, perfume_id, fetched_at) values ('wikidata', 'https://www.wikidata.org/wiki/Q139990264', 'vivienne-westwood', '{"url":"https://www.wikidata.org/wiki/Q139990264","name":"Boudoir","brand":"Vivienne Westwood","brandName":"Vivienne Westwood","brandSlug":"vivienne-westwood","size":null,"gender":null,"year":1998,"perfumers":null,"sourceLabel":"Wikidata (CC0)","notesStatus":"a-confirmar","notesNote":"Pirâmide do Wikidata (base colaborativa, licença CC0). Conferir com a marca antes de publicar.","fetchedAt":"2026-10-25T22:35:10.710Z","notesEn":{"top":["aldehydes","hyacinth flowers","orange blossom","bergamot"],"heart":["carnation","rose","cardamom","coriander","narcissus flowers","orris root","jasmine"],"base":["vanilla","tobacco","cinnamon","sandalwood","patchouli"]},"notes":{"top":["Aldeídos","Jacinto","Flor de laranjeira","Bergamota"],"heart":["Cravo (flor)","Rosa","Cardamomo","Coentro","Narciso","Íris","Jasmim"],"base":["Baunilha","Tabaco","Canela","Sândalo","Patchouli"]},"unknownNotes":[],"review":"ok"}'::jsonb,
  'pendente', null, '2026-10-25T22:35:10.710Z')
  on conflict (url) do update set payload = excluded.payload, fetched_at = excluded.fetched_at where public.import_drafts.status = 'pendente';
insert into public.import_drafts (source, url, brand_slug, payload, status, perfume_id, fetched_at) values ('wikidata', 'https://www.wikidata.org/wiki/Q140002309', 'vivienne-westwood', '{"url":"https://www.wikidata.org/wiki/Q140002309","name":"Boudoir Sin Garden","brand":"Vivienne Westwood","brandName":"Vivienne Westwood","brandSlug":"vivienne-westwood","size":null,"gender":null,"year":2007,"perfumers":null,"sourceLabel":"Wikidata (CC0)","notesStatus":"a-confirmar","notesNote":"Pirâmide do Wikidata (base colaborativa, licença CC0). Conferir com a marca antes de publicar.","fetchedAt":"2026-10-25T22:35:10.709Z","notesEn":{"top":["freesia","aldehydes","pink pepper"],"heart":["heliotrope","violets","iris"],"base":["oakmoss","sandalwood","musk","amber"]},"notes":{"top":["Frésia","Aldeídos","Pimenta-rosa"],"heart":["Heliotrópio","Violeta","Íris"],"base":["Musgo de carvalho","Sândalo","Almíscar","Âmbar"]},"unknownNotes":[],"review":"ok"}'::jsonb,
  'pendente', null, '2026-10-25T22:35:10.709Z')
  on conflict (url) do update set payload = excluded.payload, fetched_at = excluded.fetched_at where public.import_drafts.status = 'pendente';
insert into public.import_drafts (source, url, brand_slug, payload, status, perfume_id, fetched_at) values ('wikidata', 'https://www.wikidata.org/wiki/Q139991116', 'vivienne-westwood', '{"url":"https://www.wikidata.org/wiki/Q139991116","name":"Cheeky Alice","brand":"Vivienne Westwood","brandName":"Vivienne Westwood","brandSlug":"vivienne-westwood","size":null,"gender":null,"year":2011,"perfumers":null,"sourceLabel":"Wikidata (CC0)","notesStatus":"a-confirmar","notesNote":"Pirâmide do Wikidata (base colaborativa, licença CC0). Conferir com a marca antes de publicar.","fetchedAt":"2026-10-25T22:35:10.709Z","notesEn":{"top":["lily-of-the-valley"],"heart":["peony","rose"],"base":["musk","woody"]},"notes":{"top":["Lírio-do-vale"],"heart":["Peônia","Rosa"],"base":["Almíscar","Notas amadeiradas"]},"unknownNotes":[],"review":"ok"}'::jsonb,
  'pendente', null, '2026-10-25T22:35:10.709Z')
  on conflict (url) do update set payload = excluded.payload, fetched_at = excluded.fetched_at where public.import_drafts.status = 'pendente';
insert into public.import_drafts (source, url, brand_slug, payload, status, perfume_id, fetched_at) values ('wikidata', 'https://www.wikidata.org/wiki/Q139991158', 'vivienne-westwood', '{"url":"https://www.wikidata.org/wiki/Q139991158","name":"Flirty Alice","brand":"Vivienne Westwood","brandName":"Vivienne Westwood","brandSlug":"vivienne-westwood","size":null,"gender":null,"year":2013,"perfumers":null,"sourceLabel":"Wikidata (CC0)","notesStatus":"a-confirmar","notesNote":"Pirâmide do Wikidata (base colaborativa, licença CC0). Conferir com a marca antes de publicar.","fetchedAt":"2026-10-25T22:35:10.709Z","notesEn":{"top":["green tea","bergamot"],"heart":["rose"],"base":["woody","vanilla"]},"notes":{"top":["Chá verde","Bergamota"],"heart":["Rosa"],"base":["Notas amadeiradas","Baunilha"]},"unknownNotes":[],"review":"ok"}'::jsonb,
  'pendente', null, '2026-10-25T22:35:10.709Z')
  on conflict (url) do update set payload = excluded.payload, fetched_at = excluded.fetched_at where public.import_drafts.status = 'pendente';
insert into public.import_drafts (source, url, brand_slug, payload, status, perfume_id, fetched_at) values ('wikidata', 'https://www.wikidata.org/wiki/Q139990185', 'vivienne-westwood', '{"url":"https://www.wikidata.org/wiki/Q139990185","name":"Let It Rock","brand":"Vivienne Westwood","brandName":"Vivienne Westwood","brandSlug":"vivienne-westwood","size":null,"gender":null,"year":2007,"perfumers":null,"sourceLabel":"Wikidata (CC0)","notesStatus":"a-confirmar","notesNote":"Pirâmide do Wikidata (base colaborativa, licença CC0). Conferir com a marca antes de publicar.","fetchedAt":"2026-10-25T22:35:10.709Z","notesEn":{"top":["bergamot","freesia","mandarin orange"],"heart":["jasmine"],"base":["patchouli","amber"]},"notes":{"top":["Bergamota","Frésia","Tangerina"],"heart":["Jasmim"],"base":["Patchouli","Âmbar"]},"unknownNotes":[],"review":"ok"}'::jsonb,
  'pendente', null, '2026-10-25T22:35:10.709Z')
  on conflict (url) do update set payload = excluded.payload, fetched_at = excluded.fetched_at where public.import_drafts.status = 'pendente';
insert into public.import_drafts (source, url, brand_slug, payload, status, perfume_id, fetched_at) values ('wikidata', 'https://www.wikidata.org/wiki/Q140003040', 'vivienne-westwood', '{"url":"https://www.wikidata.org/wiki/Q140003040","name":"Libertine","brand":"Vivienne Westwood","brandName":"Vivienne Westwood","brandSlug":"vivienne-westwood","size":null,"gender":null,"year":2000,"perfumers":null,"sourceLabel":"Wikidata (CC0)","notesStatus":"a-confirmar","notesNote":"Pirâmide do Wikidata (base colaborativa, licença CC0). Conferir com a marca antes de publicar.","fetchedAt":"2026-10-25T22:35:10.709Z","notesEn":{"top":["pineapple","grapefruit","passionfruit"],"heart":["honeysuckle","bergamot","lily-of-the-valley","rose"],"base":["oakmoss","musk","patchouli","labdanum","amber"]},"notes":{"top":["Abacaxi","Toranja","Maracujá"],"heart":["Madressilva","Bergamota","Lírio-do-vale","Rosa"],"base":["Musgo de carvalho","Almíscar","Patchouli","Ládano","Âmbar"]},"unknownNotes":[],"review":"ok"}'::jsonb,
  'pendente', null, '2026-10-25T22:35:10.709Z')
  on conflict (url) do update set payload = excluded.payload, fetched_at = excluded.fetched_at where public.import_drafts.status = 'pendente';
insert into public.import_drafts (source, url, brand_slug, payload, status, perfume_id, fetched_at) values ('wikidata', 'https://www.wikidata.org/wiki/Q140001990', 'vivienne-westwood', '{"url":"https://www.wikidata.org/wiki/Q140001990","name":"Mon Boudoir","brand":"Vivienne Westwood","brandName":"Vivienne Westwood","brandSlug":"vivienne-westwood","size":null,"gender":null,"year":2013,"perfumers":null,"sourceLabel":"Wikidata (CC0)","notesStatus":"a-confirmar","notesNote":"Pirâmide do Wikidata (base colaborativa, licença CC0). Conferir com a marca antes de publicar.","fetchedAt":"2026-10-25T22:35:10.709Z","notesEn":{"top":["pear","basil","mandarin orange"],"heart":["lily-of-the-valley","rose","jasmine"],"base":["white musk","sandalwood"]},"notes":{"top":["Pera","Manjericão","Tangerina"],"heart":["Lírio-do-vale","Rosa","Jasmim"],"base":["Almíscar branco","Sândalo"]},"unknownNotes":[],"review":"ok"}'::jsonb,
  'pendente', null, '2026-10-25T22:35:10.709Z')
  on conflict (url) do update set payload = excluded.payload, fetched_at = excluded.fetched_at where public.import_drafts.status = 'pendente';
insert into public.import_drafts (source, url, brand_slug, payload, status, perfume_id, fetched_at) values ('wikidata', 'https://www.wikidata.org/wiki/Q139991574', 'vivienne-westwood', '{"url":"https://www.wikidata.org/wiki/Q139991574","name":"Sunny Alice","brand":"Vivienne Westwood","brandName":"Vivienne Westwood","brandSlug":"vivienne-westwood","size":null,"gender":null,"year":2014,"perfumers":null,"sourceLabel":"Wikidata (CC0)","notesStatus":"a-confirmar","notesNote":"Pirâmide do Wikidata (base colaborativa, licença CC0). Conferir com a marca antes de publicar.","fetchedAt":"2026-10-25T22:35:10.709Z","notesEn":{"top":["sea","pink pepper"],"heart":["Jasminum sambac"],"base":["amber","vanilla","sandalwood"]},"notes":{"top":["Notas marinhas","Pimenta-rosa"],"heart":["Jasmim sambac"],"base":["Âmbar","Baunilha","Sândalo"]},"unknownNotes":[],"review":"ok"}'::jsonb,
  'pendente', null, '2026-10-25T22:35:10.709Z')
  on conflict (url) do update set payload = excluded.payload, fetched_at = excluded.fetched_at where public.import_drafts.status = 'pendente';
commit;
