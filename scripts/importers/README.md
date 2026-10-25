# Importadores de fabricantes

Leem **fatos** de páginas oficiais (nome, código, volume, público, pirâmide olfativa) e geram
**rascunhos** em `data/imports/<marca>.json` para revisão humana. Nada é publicado direto.

## Regras (valem para qualquer marca nova)

1. Antes de criar o adaptador, ler os **termos de uso** da marca. Se proibirem robôs ou extração, não fazer — pedir acesso/feed à marca.
2. Ler o **robots.txt** a cada execução e obedecer `Disallow` e `Crawl-delay` (mínimo de 10 s entre páginas).
3. **Não contornar** proteções antirrobô (Cloudflare, Akamai, captchas). Bloqueio = a marca não quer acesso automatizado.
4. Identificar-se como `ZeniteBot` com o endereço do projeto. Sem dados pessoais no cabeçalho.
5. Extrair só fatos. **Não copiar** fotos, descrições de marketing, avaliações de clientes nem preços.
6. Guardar a URL de origem e a data de leitura de cada item (vira a fonte citada na resenha).

## Status por marca

Verificado em 25/10/2026 (termos de uso + robots.txt). Rever antes de cada nova importação.

| Marca | Site | Situação |
|---|---|---|
| Lattafa | lattafa.com | ✅ Permitido: termos sem restrição a robôs, robots.txt com crawl-delay 10 s. Pirâmide em dados estruturados. |
| Afnan | afnan.com | ✅ Permitido: robots.txt libera páginas de produto (e publica um sitemap para agentes); termos sem proibição a robôs. `shopify.mjs` |
| Swiss Arabian | swissarabian.com | ✅ Permitido: robots.txt libera produtos; termos sem proibição a robôs. Volume não aparece na página. `shopify.mjs` |
| Khadlaj | khadlaj-perfumes.com | ✅ Permitido: robots.txt libera produtos; termos sem proibição a robôs. `shopify.mjs` |
| Wikidata (várias marcas) | wikidata.org | ✅ Dados abertos (CC0), consulta pública com identificação. Pirâmide com camada (P5872 + P1552). Tudo entra "a confirmar" (base colaborativa). `wikidata.mjs` |
| Armaf | armaf.com | ⛔ Termos proíbem "spider, crawl, or scrape". |
| French Avenue | frenchavenue.com | ⛔ Termos proíbem robôs/extração. |
| Rayhaan | rayhaanperfumes.com | ⛔ Termos proíbem robôs/extração. |
| Orientica | orientica.com | ⛔ robots.txt bloqueia robôs de IA. |
| Maison Alhambra | maisonalhambra.com | ⛔ Loja fechada com senha. |
| Al Haramain | alharamainperfumes.com | ⛔ Site institucional sem páginas de produto (404). |
| Rasasi | rasasi.com | ⛔ Produtos só por chamada interna do site (sem página pública). |
| Ajmal | ajmal.com | ⛔ Sem robots.txt acessível. |
| Paris Corner | pariscorner.ae | ⏸ Permitido, mas as páginas não trazem a pirâmide. |
| Dior | dior.com | ⏸ Sem pirâmide (topo/coração/fundo): só texto de marketing citando notas. |
| Carolina Herrera | carolinaherrera.com | ⛔ Termos proíbem uso comercial das informações do site. |
| Rabanne | rabanne.com | ⛔ Termos não legíveis sem JavaScript; mesmo grupo (Puig) da Carolina Herrera. |
| Chanel | chanel.com | ⛔ Acesso negado (403). |
| YSL Beauty | yslbeauty.com | ⛔ Acesso negado (403) na página inicial. |
| Natura | natura.com.br | ⛔ robots.txt bloqueia robôs de IA (inclusive ClaudeBot). |
| O Boticário | boticario.com.br | ⛔ Bloqueado por proteção antirrobô (Akamai). Caminho: pedir feed/catálogo à marca ou programa de afiliados. |
| Eudora | eudora.com.br | ⛔ Conexão recusada pela proteção do site. |
| Fragrantica | fragrantica.com(.br) | ⛔ robots.txt bloqueia robôs de IA; sem licença de uso. |
| Parfumo | parfumo.com | ⏸ Base protegida pelo direito europeu de bases de dados; há contato de licenciamento — só com autorização. |
| Basenotes | basenotes.com | ⛔ Acesso negado (403). |
| Open Beauty Facts | openbeautyfacts.org | ⛔ robots.txt bloqueia robôs de IA; sem pirâmide. |
| In The Box | intheboxperfumes.com.br | ⛔ Bloqueado por proteção antirrobô (Cloudflare). Mesmo caminho acima. |

Marcas bloqueadas podem entrar pelo **cadastro manual** no painel (`/admin` → Perfumes), com a fonte citada.

## Uso

```bash
# o Node precisa usar o proxy do ambiente na nuvem
NODE_USE_ENV_PROXY=1 node scripts/importers/lattafa.mjs --limit 30
NODE_USE_ENV_PROXY=1 node scripts/importers/lattafa.mjs --only /art-of-universe/
# lojas Shopify (afnan | swiss-arabian | khadlaj)
NODE_USE_ENV_PROXY=1 node scripts/importers/shopify.mjs afnan --limit 100
# Wikidata (todas as marcas de uma vez; marcas com site oficial importado ficam de fora)
NODE_USE_ENV_PROXY=1 node scripts/importers/wikidata.mjs
```

Depois: `npm run db:seed:build` gera `supabase/seed.sql` e um arquivo por marca em
`supabase/imports/<marca>.sql` (notas + marca + rascunhos), para rodar no SQL Editor.

O importador é retomável (pula URLs já lidas). Notas sem tradução ficam em `unknownNotes`:
adicione-as em `data/notes-pt.json` (inglês → português) e em `NOTE_ACCORDS` (`src/lib/olfactory.ts`).
