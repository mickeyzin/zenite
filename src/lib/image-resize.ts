/** Recorta no centro na proporção pedida e reduz para WebP (no navegador). */
export async function cropToWebp(file: File, width: number, height: number, quality = 0.86): Promise<Blob> {
  const img = await createImageBitmap(file);
  const scale = Math.max(width / img.width, height / img.height);
  const w = img.width * scale;
  const h = img.height * scale;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Navegador sem suporte a canvas.");
  ctx.drawImage(img, (width - w) / 2, (height - h) / 2, w, h);
  img.close();
  return new Promise((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("Não foi possível converter a imagem."))), "image/webp", quality),
  );
}
