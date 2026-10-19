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

Os originais ficam em `models-source/`. As versões otimizadas usadas pelo site ficam em `public/models/` e são geradas assim:

```bash
./scripts/optimize-models.sh
```

| Modelo | Original | Desktop | Mobile |
|---|---|---|---|
| Art of Universe | 18,6 MB · 392 mil triângulos | 1,4 MB · 135 mil | 0,44 MB · 26 mil |
| Creed Wild Vetiver | 12,7 MB · 235 mil | 1,1 MB · 92 mil | 0,34 MB · 19 mil |
| Prada Paradoxe | 7,2 MB · 65 mil | 0,63 MB · 34 mil | 0,26 MB · 10 mil |

Otimização: solda de vértices, simplificação com erro máximo de 0,01% (desktop) e 0,04% (mobile) do tamanho do modelo, compressão Meshopt e texturas WebP (2048 px no desktop, 1024 px no mobile).

### O que a inspeção mostrou (os três arquivos)

- Gerados pelo **Meshy AI**: **uma única malha e um único material** por frasco. Não há partes separadas (vidro, tampa, líquido, rótulo).
- Material PBR opaco (`alphaMode: OPAQUE`) com 3 texturas 2048 px: cor, metal/rugosidade e normal. O vidro, os reflexos, os logotipos e os rótulos estão **pintados na textura**.
- **Não há líquido interno**, nem transparência real, nem animações.
- Escala ~1,9 unidade de altura, centralizados, frente voltada para +Z (orientação já correta).
- O verso dos frascos foi "imaginado" pela IA do Meshy e tem menos detalhe que a frente.

### Ajuste de material aplicado

Em `src/components/three/PerfumeBottle.tsx`: o material original é trocado por um `MeshPhysicalMaterial` que usa **exatamente as mesmas texturas**, mais uma camada fina de verniz (clearcoat 0,7) para o brilho de vidro polido. Cores, rótulos e logotipos não mudam. Para voltar ao visual original: `clearcoat={0}`.

**Não aplicado (precisa de decisão):** transmissão/refração real e líquido animado. Como vidro, tampa e rótulo estão na mesma malha, ligar a transmissão deixaria o rótulo e a tampa translúcidos. Para ter vidro e líquido reais é preciso separar a malha (no Blender, ou um modelo refeito com peças separadas).

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
