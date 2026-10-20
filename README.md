# Zênite — Perfumes Cósmicos

Portal editorial de perfumaria com apresentação cinematográfica em 3D. **Não é uma loja**: sem carrinho, checkout ou estoque. A monetização futura será por links de afiliado identificados.

Estado atual: **Fases 1 e 2** — inspeção dos modelos + primeira cena (Lattafa Pride Art of Universe) com quatro etapas de scroll.

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

## Dados e transparência

Cada informação tem um status exibido ao leitor: **Verificado**, **A confirmar** ou **Provisório**.

- Pirâmide olfativa do Art of Universe: igual em vários varejistas (Superdrug, Justmylook, Bjutip) → "A confirmar" até checar a embalagem oficial.
- Ano de lançamento e família olfativa: as fontes divergem → "A confirmar".
- Métricas de desempenho, nota, pontos positivos e negativos: **valores ilustrativos**, marcados como provisórios até o teste editorial.

## Próximas fases

3. Creed Wild Vetiver e Prada Paradoxe + transições entre universos · 4. Linha Zênite · 5. Catálogo e resenhas · 6. Supabase e painel administrativo · 7. IA de mapeamento olfativo (precisa do código da integração anterior) · 8. Afiliados Mercado Livre · 9. Otimização e deploy.
