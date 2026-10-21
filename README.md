# Zênite — Perfumes Cósmicos

Portal editorial de perfumaria com apresentação cinematográfica em 3D. **Não é uma loja**: sem carrinho, checkout ou estoque. A monetização futura será por links de afiliado identificados.

Estado atual: **Fases 1 a 6 e parte da 8** — três perfumes (Lattafa Pride Art of Universe, Creed Wild Vetiver, Prada Paradoxe Intense) numa rolagem contínua, cada um com quatro etapas e universo próprio, e transições reversíveis entre eles.

## Rodar localmente

```bash
npm install
npm run dev          # http://localhost:3000
# ou, mais fiel à produção:
npm run build && npm start
```

Para testar:

- **Desktop**: role devagar. O frasco gira em 4 etapas (Frente → Perfil → Verso → Perspectiva). Role para cima: tudo volta, sincronizado. Os pontos à direita levam direto a cada etapa.
- **Celular**: DevTools → modo dispositivo (ex.: 390×844), recarregue a página. O frasco fica no topo e o texto embaixo.
- **Movimento reduzido**: DevTools → Rendering → "Emulate CSS prefers-reduced-motion: reduce". Aparece a versão estática, com botão para ativar o 3D.
- **Sem WebGL**: `chrome://flags` → desative WebGL, ou teste num navegador sem suporte. Aparece a versão estática.
- **Resenha completa**: `/perfumes/lattafa-art-of-universe` (funciona sem 3D).

### Verificação automatizada (prints)

```bash
node scripts/shoot.mjs <pasta> 1440 900 0,0.19,0.42,0.64,0.86   # desktop
node scripts/shoot.mjs <pasta> 390 844 0.19,0.42,0.64,0.86      # mobile
```

Usa o Chromium do Playwright com GPU por software. O caminho do Chromium vem de `CHROME_PATH`.

## Modelos 3D

Originais em `models-source/`. O site usa versões com **peças separadas** em `public/models/*.parts*.glb`
(vidro, metais, rótulo, tampa e um volume de líquido gerado), criadas por `scripts/models/` — veja
`scripts/models/README.md`.

| Frasco | Peças | Desktop | Mobile |
|---|---|---|---|
| Art of Universe | corpo azul opaco, placa (só na frente, arte plana), tampa — sem líquido, como o frasco real | 1,7 MB | 0,58 MB |
| Creed Wild Vetiver | vidro incolor, impressão, tampa, líquido verde | 1,5 MB | 0,60 MB |
| Prada Paradoxe | vidro incolor, colar, tampa, líquido rosa | 0,9 MB | 0,33 MB |

- **Vidro**: `MeshPhysicalMaterial` com transmissão e refração reais. A aparência fica em `look` (`src/data/perfumes.ts`).
- **Líquido**: recortado por um plano que acompanha a gravidade e balança como uma mola amortecida conforme o frasco gira; com menisco claro na borda.
- **Céu**: renderizado uma vez num cubemap, assim a refração do vidro não desenha o shader da nebulosa duas vezes por quadro.
- **Laboratório**: `/laboratorio?p=<slug>` mostra um frasco isolado para inspeção (arraste para girar).

O que a inspeção dos arquivos originais mostrou: malha única do Meshy AI, material opaco com cor/metal/normal em textura de 2048 px, sem líquido nem animações, frente em +Z. O verso e alguns textos foram "imaginados" pela IA (ex.: inscrição deformada no Creed).

## Arquitetura

```
src/
  app/                    rotas (App Router): home, /perfumes/[slug], sitemap, robots
  data/                   tipos e dados dos perfumes, com status por campo
  lib/timeline.ts         roteiro do scroll: etapas, câmera, rotação (fonte única de sincronia)
  lib/experience-state.ts estado compartilhado DOM ↔ WebGL (fora do React, sem re-render)
  components/experience/  seção fixa com ScrollTrigger, painéis editoriais, fallback
  components/three/       cena R3F: céu de nebulosa, camadas de gás, estrelas, poeira, planetas, frasco
```

- **Scroll**: seção com `position: sticky` (mais estável que pin) + uma timeline GSAP com `scrub`. Uma única propriedade da timeline é o relógio mestre; textos e 3D leem o mesmo valor, por isso ficam sincronizados nos dois sentidos.
- **Lenis**: não usado. A rolagem nativa + o scrub do GSAP + o damping no loop 3D já dão suavidade sem sequestrar a rolagem nem afetar acessibilidade.
- **Galáxia**: shader procedural na esfera de fundo (faixa galáctica, gás com domain warping, poeira escura), 5 camadas de nebulosa em profundidades diferentes (paralaxe), 3 camadas de estrelas reais, poeira com bokeh e planetas com atmosfera.
- **Reflexos**: mapa de ambiente HDR gerado em tempo real com painéis de luz nas cores do universo (sem baixar HDRI externo). A luz principal acompanha a rotação; uma luz de varredura cruza o frasco a cada virada.
- **Pós-processamento**: bloom moderado, vinheta, grão e tone mapping Neutral (o ACES deixava os azuis roxos).
- **Desempenho**: modelo mobile mais leve, menos partículas no celular, `PerformanceMonitor` reduz a resolução se o FPS cair, e o render pausa quando a cena sai da tela.
- **SEO/acessibilidade**: todo o texto das etapas é HTML renderizado no servidor; navegação por teclado leva até a etapa focada; link para pular o conteúdo; dados estruturados na resenha.

## Transições entre perfumes

A seção tem 7 telas por perfume (`SCREENS_PER_PERFUME`). Tudo deriva do mesmo progresso de scroll (`src/lib/timeline.ts`):

- `perfumeAt` → perfume ativo e progresso local; as 4 etapas valem para cada trecho.
- `themeMix` → universo contínuo (0, 1, 2…): céu (3 cubemaps pré-calculados e misturados), nebulosas, estrelas, poeira, planetas e luzes trocam de cor gradualmente.
- `dissolveAt` → o frasco se dissolve de cima para baixo com borda luminosa (`components/three/dissolve.ts`) e o próximo se forma ao contrário.
- `burstPhase` / `boundaryGlow` → partículas que se espalham e convergem, e o ponto de luz que nasce na fronteira.
- O ambiente de reflexos é trocado no instante em que nenhum frasco está visível.

Para adicionar um perfume à apresentação, basta incluí-lo em `featuredPerfumes` com seu `theme` (paletas do universo) e `look` (materiais).

## Linha Zênite

- **Constelação** (`components/three/Constellation.tsx`): no fim da apresentação, estrelas voam até formar uma figura e se ligam por traços de luz. O desenho é definido em coordenadas de tela e projetado com a câmera do último quadro, então a estrela-âncora fica sempre a 86% da altura, no centro.
- **Linha** (`components/trail/ZeniteTrail.tsx`): SVG que parte da âncora e passa por cada elemento com `data-zenite-star`. A ponta acompanha a linha de leitura (62% da tela): rolar desenha, subir recua. Cada estrela alcançada acende com uma pequena constelação.
- Fica atrás do conteúdo (`pointer-events: none`). No celular corre pela margem esquerda. Com "reduzir movimento", aparece já desenhada.
- O percurso (`components/trail/HomeTrail.tsx`) apresenta as próximas áreas, marcadas "Em breve" com a fase prevista.

## Catálogo, resenhas e comparações

- `/catalogo`: busca (nome, marca, notas, família) e filtros (família, perfil predominante, marca, concentração, público, estação, ocasião), com ordenação. O estado fica na URL. Intensidade e preço ficam desativados até haver avaliação editorial e ofertas verificadas.
- `/perfumes/[slug]`: resenha completa. Separa **dados do perfume** (com fonte e status), **perfil estimado**, **avaliação editorial** (provisória) e **opiniões de usuários** (em breve).
- `/comparar?a=…&b=…`: dois perfumes lado a lado, com notas em comum destacadas.
- **Perfil olfativo estimado** (`src/lib/olfactory.ts`): cada nota tem pesos por acorde. Daí saem doçura, frescor, presença amadeirada e presença especiada, sempre rotuladas como estimativa. Nota nova → cadastrar em `NOTE_ACCORDS` (a página avisa se faltar).
- **Semelhantes** (`src/lib/similarity.ts`): 55% acordes, 35% notas em comum, 5% estações, 5% ocasiões. Abaixo de 35% aparece como "pouca semelhança"; o texto nunca afirma que são iguais.
- Gráficos (`src/components/charts`): medidores e barras em HTML/CSS, renderizados no servidor, com valor em texto; a comparação usa duas cores validadas contra o fundo escuro.

## Banco de dados e painel (Supabase)

Passo a passo para ligar: [`docs/supabase-setup.md`](docs/supabase-setup.md).

- **Esquema** (`supabase/migrations/0001_init.sql`): perfumes com situação por campo (verificado, a confirmar, provisório), notas e acordes, avaliação editorial separada dos fatos, fontes, imagens, modelos 3D, lojas e ofertas (link de afiliado exige marcação de afiliado), histórico de preços e de alterações, fila de rascunhos importados.
- **Segurança**: regras RLS no próprio banco. Visitantes leem só o que está publicado; só contas na tabela `admins` escrevem. O site usa apenas a chave pública — nenhuma chave secreta no código.
- **Leitura no site** (`src/data/catalog.ts`): em cache, com etiqueta `perfumes`. Sem as variáveis do Supabase, ou se o banco falhar, usa os dados locais.
- **Painel** `/admin`: aprovar importados (a função `approve_draft` liga as notas pelos apelidos e cria as que faltam), publicar e editar perfumes, classificar notas, cadastrar ofertas e pôsteres. Ao salvar, `/api/revalidar` atualiza o cache (só para admins).
- **Testes**: `npm run db:test` (28 verificações de permissão) e `npm run db:test:roundtrip` (dados locais → banco → site, sem perdas).

## Ofertas e afiliados

- Resenha: ofertas da mais barata para a mais cara, botão **"Ver melhor oferta"**, etiqueta **"Link de afiliado"** e aviso de comissão. Preço só com data de conferência; com mais de 3 dias, deixa de aparecer.
- `/oferta/[id]`: conta o clique (oferta, horário e página; sem dados pessoais) e redireciona com `rel="sponsored"`.
- Alternativas mais baratas: semelhantes (afinidade ≥ 35%) com preço confirmado menor.
- **API do Mercado Livre** (testado em out/2026): o token do app é gerado, mas anúncios, busca e até `/currencies/BRL` respondem 403 (`PolicyAgent`), também no navegador sem token. Por isso os preços são conferidos à mão no painel (aba Ofertas: "Preços para conferir" e "Confirmar preço"), e o link de afiliado vem do painel de afiliados do Mercado Livre. Nada de raspagem.

## Dados e transparência

Cada informação tem um status exibido ao leitor: **Verificado**, **A confirmar** ou **Provisório**.

- Pirâmide olfativa do Art of Universe: igual em vários varejistas (Superdrug, Justmylook, Bjutip) → "A confirmar" até checar a embalagem oficial.
- Ano de lançamento e família olfativa: as fontes divergem → "A confirmar".
- Métricas de desempenho, nota, pontos positivos e negativos: **valores ilustrativos**, marcados como provisórios até o teste editorial.

## Próximas fases

7. IA de mapeamento olfativo (precisa do código da integração anterior) · 8. Afiliados Mercado Livre · 9. Otimização e deploy.
