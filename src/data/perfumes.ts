import type { BottleEntry, Perfume } from "./types";

const retailSources = [
  { label: "Superdrug", url: "https://www.superdrug.com/fragrance/fragrance-for-him/mens-aftershave/lattafa-pride-art-of-universe-100ml-eau-de-parfum-for-men/p/mp-00452156" },
  { label: "Justmylook", url: "https://www.justmylook.com/products/lattafa-pride-art-of-universe-eau-de-parfum-100ml" },
  { label: "Bjutip", url: "https://www.bjutip.com/unisex-perfumes/unisex-eau-de-parfum/lattafa-pride-art-of-universe-edp-u-100-ml" },
];

export const artOfUniverse: Perfume = {
  slug: "lattafa-art-of-universe",
  brand: "Lattafa",
  line: "Lattafa Pride",
  name: "Art of Universe",
  fullName: "Lattafa Pride Art of Universe",
  model: {
    desktop: "/models/art-of-universe.parts.glb",
    mobile: "/models/art-of-universe.parts.mobile.glb",
  },
  frontRotationY: 0,
  concentration: { value: "Eau de Parfum", status: "verificado", sources: retailSources },
  family: {
    value: "Aromático · Cítrico · Amadeirado",
    status: "a-confirmar",
    note: "Varejistas divergem na classificação da família olfativa.",
  },
  year: { value: null, status: "a-confirmar", note: "Ano de lançamento ainda não confirmado em fonte oficial." },
  gender: { value: "Unissex", status: "a-confirmar", note: "A maioria dos varejistas classifica como unissex." },
  intro: {
    value:
      "Uma abertura cítrica e aromática de bergamota, tangerina, gengibre e menta conduz a um coração de pera e flor de laranjeira, pousado sobre cedro, âmbar e almíscar. Um frasco que leva o cosmos para a penteadeira.",
    status: "provisorio",
    note: "Resumo baseado na pirâmide declarada. A resenha editorial completa está em produção.",
  },
  notes: {
    value: {
      top: ["Bergamota", "Tangerina", "Gengibre", "Menta"],
      heart: ["Pera", "Flor de laranjeira"],
      base: ["Cedro", "Âmbar", "Almíscar"],
    },
    status: "a-confirmar",
    note: "Pirâmide coincidente entre vários varejistas; confirmação na embalagem oficial pendente.",
    sources: retailSources,
  },
  evolution: {
    value: [
      { phase: "Saída", text: "Brilho cítrico da bergamota e da tangerina, com o frescor picante do gengibre e da menta." },
      { phase: "Coração", text: "A pera traz suculência; a flor de laranjeira acrescenta luminosidade floral." },
      { phase: "Fundo", text: "Cedro, âmbar e almíscar formam uma base macia e amadeirada." },
    ],
    status: "provisorio",
    note: "Estrutura esperada a partir das notas declaradas — ainda não testada pela Zênite.",
  },
  performance: {
    value: [
      { key: "fixacao", label: "Fixação", value: 7 },
      { key: "projecao", label: "Projeção", value: 6 },
      { key: "intensidade", label: "Intensidade", value: 6 },
      { key: "versatilidade", label: "Versatilidade", value: 8 },
    ],
    status: "provisorio",
    note: "Valores ilustrativos para validar o layout. Serão substituídos pelo teste editorial.",
  },
  seasons: { value: ["Primavera", "Verão"], status: "provisorio" },
  occasions: { value: ["Dia a dia", "Trabalho", "Encontros casuais"], status: "provisorio" },
  verdict: {
    rating: { value: null, status: "provisorio", note: "Nota editorial em avaliação." },
    pros: {
      value: [
        "Pirâmide cítrico-aromática com fundo amadeirado, de perfil versátil",
        "Frasco colecionável com placa metálica e planetas em relevo",
      ],
      status: "provisorio",
    },
    cons: {
      value: ["Desempenho ainda não testado pela Zênite"],
      status: "provisorio",
    },
    profile: {
      value: "Quem procura frescor cítrico com um fundo amadeirado e macio.",
      status: "provisorio",
    },
    similar: {
      value: [],
      status: "provisorio",
      note: "Comparações em curadoria — serão geradas a partir do catálogo.",
    },
  },
  theme: {
    deep: "#020615",
    mid: "#0a2a7a",
    glow: "#1a63ff",
    accent: "#31c7f3",
    stars: ["#ffffff", "#cfe9ff", "#8fdcff", "#31c7f3"],
    keyLight: "#dce9ff",
    rimLight: "#2f7bff",
    fillLight: "#7d5cff",
  },
  look: {
    // Transparência do vidro a confirmar com o frasco real.
    glass: { useTexture: true, tint: "#ffffff", transmission: 0.82, thickness: 0.45, roughness: 0.06, attenuationColor: "#5a86ff", attenuationDistance: 2.2, brightness: 2.6 },
    liquid: { color: "#2448d8", surfaceColor: "#cfe6ff", fill: 0.8 },
  },
};

export const featuredPerfumes: Perfume[] = [artOfUniverse];

/**
 * Frascos disponíveis para o laboratório e para as próximas cenas. Creed e
 * Prada ainda não têm resenha; os temas e a aparência são preliminares (Fase 3).
 */
export const bottles: BottleEntry[] = [
  artOfUniverse,
  {
    slug: "creed-wild-vetiver",
    name: "Creed Wild Vetiver",
    model: { desktop: "/models/creed-wild-vetiver.parts.glb", mobile: "/models/creed-wild-vetiver.parts.mobile.glb" },
    theme: {
      deep: "#020a06",
      mid: "#0b3a22",
      glow: "#1f9c5a",
      accent: "#d8b45a",
      stars: ["#ffffff", "#f3ead2", "#cfe9c8", "#d8b45a"],
      keyLight: "#fff3d6",
      rimLight: "#2fbf72",
      fillLight: "#d8b45a",
    },
    look: {
      glass: { useTexture: false, tint: "#f4fbf1", transmission: 1, thickness: 0.5, roughness: 0.03, attenuationColor: "#e6f3df", attenuationDistance: 3, brightness: 1 },
      liquid: { color: "#5f9a2c", surfaceColor: "#d6efb0", fill: 0.84 },
    },
  },
  {
    slug: "prada-paradoxe",
    name: "Prada Paradoxe",
    model: { desktop: "/models/prada-paradoxe.parts.glb", mobile: "/models/prada-paradoxe.parts.mobile.glb" },
    theme: {
      deep: "#0a0210",
      mid: "#4a0f3f",
      glow: "#ff3d9a",
      accent: "#ffb3d1",
      stars: ["#ffffff", "#ffe3ef", "#ffc2dc", "#c79bff"],
      keyLight: "#fff0f6",
      rimLight: "#ff4fa3",
      fillLight: "#a65cff",
    },
    look: {
      glass: { useTexture: false, tint: "#fff7f9", transmission: 1, thickness: 0.6, roughness: 0.03, attenuationColor: "#ffe8ee", attenuationDistance: 3, brightness: 1 },
      liquid: { color: "#ff6f86", surfaceColor: "#ffd6de", fill: 0.78 },
    },
  },
];

export function getPerfume(slug: string) {
  return featuredPerfumes.find((p) => p.slug === slug);
}
