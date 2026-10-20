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

| Marca | Site | Situação |
|---|---|---|
| Lattafa | lattafa.com | ✅ Permitido: termos sem restrição a robôs, robots.txt com crawl-delay 10 s. Pirâmide em dados estruturados. |
| O Boticário | boticario.com.br | ⛔ Bloqueado por proteção antirrobô (Akamai). Caminho: pedir feed/catálogo à marca ou programa de afiliados. |
| In The Box | intheboxperfumes.com.br | ⛔ Bloqueado por proteção antirrobô (Cloudflare). Mesmo caminho acima. |

## Uso

```bash
# o Node precisa usar o proxy do ambiente na nuvem
NODE_USE_ENV_PROXY=1 node scripts/importers/lattafa.mjs --limit 30
NODE_USE_ENV_PROXY=1 node scripts/importers/lattafa.mjs --only /art-of-universe/
```

O importador é retomável (pula URLs já lidas). Notas sem tradução ficam em `unknownNotes`:
adicione-as em `data/notes-pt.json` (inglês → português) e em `NOTE_ACCORDS` (`src/lib/olfactory.ts`).
