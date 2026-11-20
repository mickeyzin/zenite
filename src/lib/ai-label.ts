/** Marca das imagens geradas por IA (campo `license` de perfume_images). Seguro para o navegador. */
export const AI_LICENSE = "ia";
export const AI_CREDIT = "Ilustração gerada por IA a partir do frasco oficial";
export const AI_NOTICE = "Imagem gerada por IA: pode conter diferenças em relação ao frasco real.";
export const isAiImage = (license: string | null | undefined) => (license ?? "").trim().toLowerCase() === AI_LICENSE;
