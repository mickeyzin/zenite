#!/usr/bin/env bash
# Gera versões otimizadas dos GLB originais (models-source/) em public/models/.
# - Geometria: weld + simplificação com erro mínimo (0,01% da extensão) + compressão Meshopt.
# - Texturas: WebP. Desktop mantém 2048px; mobile usa 1024px.
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p public/models
for f in models-source/*.glb; do
  name=$(basename "$f" .glb)
  npx gltf-transform optimize "$f" "public/models/$name.glb" \
    --compress meshopt --texture-compress webp --texture-size 2048 \
    --simplify true --simplify-error 0.0001
  npx gltf-transform optimize "$f" "public/models/$name.mobile.glb" \
    --compress meshopt --texture-compress webp --texture-size 1024 \
    --simplify true --simplify-error 0.0004
done
ls -lh public/models
