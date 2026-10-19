#!/usr/bin/env bash
# Regenera os frascos com peças separadas a partir de models-source/.
# Requer um Python com: numpy scipy trimesh scikit-image pillow (ver scripts/models/README.md).
# Uso: PY=/caminho/python scripts/models/build-all.sh [modelo ...]
set -euo pipefail
cd "$(dirname "$0")/../.."
PY=${PY:-python3}
TMP=$(mktemp -d)
MODELS=${*:-art-of-universe creed-wild-vetiver prada-paradoxe}
for m in $MODELS; do
  echo "== $m"
  "$PY" -I scripts/models/segment.py "models-source/$m.glb" "$m" "$TMP/$m.npz" "scripts/models/preview-$m.png" | tail -6
  "$PY" -I scripts/models/build_parts.py "models-source/$m.glb" "$m" "$TMP/$m.npz" "$TMP/$m.raw.glb" | tail -1
  cp "$TMP/$m.liquid.json" "public/models/$m.liquid.json"
  npx gltf-transform dedup "$TMP/$m.raw.glb" "$TMP/$m.dedup.glb" >/dev/null
  common="--compress meshopt --texture-compress webp --simplify true --simplify-lock-border true --join false --palette false --instance false"
  npx gltf-transform optimize "$TMP/$m.dedup.glb" "public/models/$m.parts.glb" $common --texture-size 2048 --simplify-error 0.0001 >/dev/null
  npx gltf-transform optimize "$TMP/$m.dedup.glb" "public/models/$m.parts.mobile.glb" $common --texture-size 1024 --simplify-error 0.0004 >/dev/null
done
rm -rf "$TMP"
ls -lh public/models/*.parts*.glb
