# Frascos com peças separadas

Os GLB do Meshy chegam como **uma malha e um material**. Este pipeline os separa em peças
(vidro, metal, rótulo, tampa…) e gera um volume de **líquido** interno, sem alterar a textura:
cada peça usa a mesma textura e o mesmo UV do arquivo original.

```bash
# uma vez: ambiente Python
python3 -m venv .venv3d && .venv3d/bin/pip install numpy scipy trimesh scikit-image pillow
# gera public/models/<modelo>.parts.glb e .parts.mobile.glb
PY=.venv3d/bin/python scripts/models/build-all.sh            # os três
PY=.venv3d/bin/python scripts/models/build-all.sh prada-paradoxe
```

- `parts.json` — regras por modelo. Cada regra é uma expressão sobre o triângulo
  (`r g b sat metal rough x y z nx ny nz`, `zf/zb` = superfície das placas frontal/traseira).
  A última regra que casa vence; `lock` impede a suavização de mudar a peça.
- `segment.py` — rotula os triângulos e salva `preview-<modelo>.png`
  (linha de cima: peças; linha de baixo: textura original). Confira essa imagem a cada ajuste.
- `build_parts.py` — exporta as peças e gera o líquido: voxeliza o frasco, desconta a
  espessura do vidro (`wall`), limita entre `bottom` e `top` (e `region`, se houver) e extrai
  uma superfície suave e fechada.

No site, `PerfumeBottle.tsx` identifica as peças pelo nome do nó; a aparência de cada frasco
(vidro tingido ou incolor, cor e nível do líquido) fica em `src/data/perfumes.ts` (`look`).
Inspecione em `/laboratorio?p=<slug>&angle=<graus>&spin=1`.

Limitações conhecidas:
- O verso e alguns textos foram "imaginados" pelo Meshy (ex.: "WILD VETIVER" deformado no Creed).
- Sob a tampa não há gargalo modelado: animar a tampa saindo exige modelar essa parte.
