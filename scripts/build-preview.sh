#!/usr/bin/env bash
# Gera uma prévia estática (sem Next.js) em preview/dist para hospedar em qualquer lugar.
set -euo pipefail
cd "$(dirname "$0")/.."
OUT=preview/dist
mkdir -p "$OUT/models" "$OUT/images/perfumes"
npx esbuild preview/entry.tsx --bundle --minify --format=esm --splitting=false \
  --outfile="$OUT/app.js" --jsx=automatic --target=es2020 \
  --alias:next/dynamic=./preview/shims/next-dynamic.tsx \
  --alias:next/image=./preview/shims/next-image.tsx \
  --alias:next/link=./preview/shims/next-link.tsx \
  --alias:@=./src --define:process.env.NODE_ENV='"production"' --log-level=warning
npx esbuild preview/lab-entry.tsx --bundle --minify --format=esm \
  --outfile="$OUT/lab.js" --jsx=automatic --target=es2020 \
  --alias:next/dynamic=./preview/shims/next-dynamic.tsx \
  --alias:next/image=./preview/shims/next-image.tsx \
  --alias:next/link=./preview/shims/next-link.tsx \
  --alias:@=./src --define:process.env.NODE_ENV='"production"' --log-level=warning
cp preview/lab.html "$OUT/lab.html"
npx tailwindcss -i src/app/globals.css -o "$OUT/style.tmp.css" --minify 2>/dev/null
cat preview/fonts.css "$OUT/style.tmp.css" > "$OUT/style.css" && rm "$OUT/style.tmp.css"
rm -f "$OUT"/models/*
for m in art-of-universe.parts art-of-universe.parts.mobile creed-wild-vetiver.parts prada-paradoxe.parts; do base64 -w0 "public/models/$m.glb" > "$OUT/models/$m.glb.txt"; done
rm -f "$OUT"/models/*.glb
cp public/images/perfumes/art-of-universe-poster.webp "$OUT/images/perfumes/"
cp public/models/*.liquid.json "$OUT/models/"
cp preview/index.html "$OUT/index.html"
ls -lh "$OUT" "$OUT/models"
