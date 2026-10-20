import type { BottleEntry, Perfume } from "./types";

const lattafaOfficial = { label: "Lattafa (site oficial)", url: "https://lattafa.com/product/art-of-universe/" };

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
  universe: "Universo azul",
  poster: "/images/perfumes/art-of-universe-poster.webp",
  sceneScale: 1,
  perfumers: { value: null, status: "a-confirmar", note: "Perfumista não divulgado nas fontes consultadas." },
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
  gender: {
    value: "Masculino",
    status: "verificado",
    note: "Classificação do site oficial da Lattafa. Alguns varejistas listam como unissex.",
    sources: [lattafaOfficial],
  },
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
    status: "verificado",
    note: "Pirâmide do site oficial da Lattafa, igual à dos varejistas consultados.",
    sources: [lattafaOfficial, ...retailSources],
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
        "Frasco colecionável com placa metálica ilustrada com planetas",
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
    nebula: [
      ["#05207f", "#1a63ff"],
      ["#071a66", "#1f6bff"],
      ["#031650", "#31c7f3"],
      ["#062a86", "#31c7f3"],
      ["#0d2a9a", "#7d5cff"],
    ],
    starTint: "#cfe9ff",
    dust: ["#9fe3ff", "#a65cff"],
    planet: ["#06163f", "#1d4fae", "#3b8bff"],
    moon: ["#9fb4d9", "#e6eefc", "#8fdcff"],
    ambient: "#3a4f9a",
  },
  look: {
    // Frasco real (fotos enviadas): corpo azul opaco acetinado, líquido não aparece.
    body: { color: "#2f4f8c", roughness: 0.45, clearcoat: 0.25 },
    // Placa real: prata clara acetinada, com a arte impressa.
    plate: { metalness: 0.5, roughness: 1 },
  },
};

const creedSources = [
  { label: "Space NK", url: "https://www.spacenk.com/ie/fragrance/personal-fragrance/fragrance/wild-vetiver-MUK200061796.html" },
  { label: "Les Senteurs", url: "https://www.lessenteurs.com/products/wild-vetiver" },
  { label: "Acquire", url: "https://acquiremag.com/style/creed-introduces-its-latest-fragrance-wild-vetiver" },
];

export const creedWildVetiver: Perfume = {
  slug: "creed-wild-vetiver",
  brand: "Creed",
  name: "Wild Vetiver",
  fullName: "Creed Wild Vetiver",
  universe: "Universo esmeralda",
  poster: "/images/perfumes/creed-wild-vetiver-poster.webp",
  sceneScale: 1,
  model: {
    desktop: "/models/creed-wild-vetiver.parts.glb",
    mobile: "/models/creed-wild-vetiver.parts.mobile.glb",
    liquid: "/models/creed-wild-vetiver.liquid.json",
  },
  frontRotationY: 0,
  concentration: { value: "Eau de Parfum", status: "verificado", sources: creedSources },
  family: { value: "Amadeirado · Aromático · Verde", status: "a-confirmar", note: "Classificação da Zênite a partir das notas; família oficial não informada." },
  year: { value: null, status: "a-confirmar", note: "As fontes divergem sobre o ano de lançamento." },
  gender: { value: "Unissex", status: "a-confirmar", note: "Listado para mulheres e homens em base de dados de perfumes." },
  perfumers: { value: null, status: "a-confirmar", note: "Perfumista não divulgado nas fontes consultadas." },
  intro: {
    value:
      "Baga timur, bergamota e pimenta-rosa abrem caminho para rosa centifólia, gerânio e broto de cassis, até um fundo de vetiver, cedro e amberwood. O verde da Creed, em versão selvagem.",
    status: "provisorio",
    note: "Resumo baseado na pirâmide oficial. A resenha editorial completa está em produção.",
  },
  notes: {
    value: {
      top: ["Baga timur", "Bergamota", "Pimenta-rosa"],
      heart: ["Rosa centifólia", "Gerânio", "Broto de cassis"],
      base: ["Vetiver", "Cedro", "Amberwood"],
    },
    status: "verificado",
    note: "Pirâmide oficial, igual nos principais varejistas.",
    sources: creedSources,
  },
  evolution: {
    value: [
      { phase: "Saída", text: "Cítrico e picante: a baga timur e a pimenta-rosa dão faísca à bergamota." },
      { phase: "Coração", text: "Rosa e gerânio, com o tom verde e frutado do broto de cassis." },
      { phase: "Fundo", text: "Vetiver em destaque, sustentado por cedro e amberwood." },
    ],
    status: "provisorio",
    note: "Estrutura esperada a partir das notas oficiais — ainda não testada pela Zênite.",
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
  seasons: { value: ["Primavera", "Verão", "Outono"], status: "provisorio" },
  occasions: { value: ["Trabalho", "Dia a dia", "Ocasiões elegantes"], status: "provisorio" },
  verdict: {
    rating: { value: null, status: "provisorio", note: "Nota editorial em avaliação." },
    pros: {
      value: ["Vetiver como protagonista, com frescor cítrico e picante", "Frasco clássico da Creed, com o perfume verde à vista"],
      status: "provisorio",
    },
    cons: { value: ["Desempenho ainda não testado pela Zênite", "Faixa de preço alta"], status: "provisorio", note: "Preço a confirmar com ofertas atualizadas." },
    profile: { value: "Quem gosta de amadeirados verdes e elegantes, com um toque floral.", status: "provisorio" },
    similar: { value: [], status: "provisorio", note: "Comparações em curadoria — serão geradas a partir do catálogo." },
  },
  theme: {
    deep: "#020a06",
    mid: "#0b3a22",
    glow: "#1f9c5a",
    accent: "#d8b45a",
    stars: ["#ffffff", "#f3ead2", "#cfe9c8", "#d8b45a"],
    keyLight: "#fff3d6",
    rimLight: "#2fbf72",
    fillLight: "#d8b45a",
    nebula: [
      ["#06371f", "#1f9c5a"],
      ["#05301b", "#2fbf72"],
      ["#03200f", "#d8b45a"],
      ["#0a4426", "#d8b45a"],
      ["#0d3d22", "#9be37a"],
    ],
    starTint: "#f3ead2",
    dust: ["#d8f5c0", "#e8c56a"],
    planet: ["#062a18", "#2f7a4a", "#7fe0a0"],
    moon: ["#b8ac7c", "#f3ead2", "#e8c56a"],
    ambient: "#2f5a3a",
  },
  look: {
    glass: { useTexture: false, tint: "#f4fbf1", transmission: 1, thickness: 0.5, roughness: 0.03, attenuationColor: "#e6f3df", attenuationDistance: 3, brightness: 1 },
    liquid: { color: "#5f9a2c", surfaceColor: "#d6efb0", fill: 0.74 },
  },
};

const pradaSources = [
  { label: "Escentual", url: "https://escentual.com/blogs/editorial/prada-paradoxe-intense-eau-de-parfum-review" },
  { label: "Perfume.com", url: "https://www.perfume.com/prada/prada-paradoxe-intense/women-perfume" },
];

export const pradaParadoxe: Perfume = {
  slug: "prada-paradoxe-intense",
  brand: "Prada",
  name: "Paradoxe Intense",
  fullName: "Prada Paradoxe Intense",
  universe: "Universo magenta",
  poster: "/images/perfumes/prada-paradoxe-poster.webp",
  sceneScale: 0.78,
  model: {
    desktop: "/models/prada-paradoxe.parts.glb",
    mobile: "/models/prada-paradoxe.parts.mobile.glb",
    liquid: "/models/prada-paradoxe.liquid.json",
  },
  frontRotationY: 0,
  concentration: { value: "Eau de Parfum", status: "verificado", sources: pradaSources },
  family: { value: "Âmbar · Floral", status: "a-confirmar", note: "Classificação da Zênite a partir das notas; família oficial não informada." },
  year: { value: "2023", status: "verificado", sources: pradaSources },
  gender: { value: "Feminino", status: "verificado", sources: pradaSources },
  perfumers: {
    value: ["Nadège Le Garlantezec", "Antoine Maisondieu", "Shyamala Maisondieu"],
    status: "verificado",
    sources: pradaSources,
  },
  intro: {
    value:
      "Pera, neroli e bergamota abrem um coração de jasmim e musgo, que se aquece em âmbar e baunilha Bourbon. A versão mais profunda do paradoxo da Prada.",
    status: "provisorio",
    note: "Resumo baseado na pirâmide declarada. A resenha editorial completa está em produção.",
  },
  notes: {
    value: {
      top: ["Pera", "Neroli", "Bergamota"],
      heart: ["Jasmim", "Musgo", "Essência de neroli"],
      base: ["Âmbar", "Baunilha Bourbon", "Ambrofix™", "Serenolide™"],
    },
    status: "a-confirmar",
    note: "Pirâmide coincidente entre as fontes consultadas; uma delas diverge na saída.",
    sources: pradaSources,
  },
  evolution: {
    value: [
      { phase: "Saída", text: "Pera e neroli luminosos, com o brilho da bergamota." },
      { phase: "Coração", text: "Jasmim cremoso, com a sombra verde do musgo." },
      { phase: "Fundo", text: "Âmbar e baunilha Bourbon, com almíscares modernos." },
    ],
    status: "provisorio",
    note: "Estrutura esperada a partir das notas declaradas — ainda não testada pela Zênite.",
  },
  performance: {
    value: [
      { key: "fixacao", label: "Fixação", value: 8 },
      { key: "projecao", label: "Projeção", value: 7 },
      { key: "intensidade", label: "Intensidade", value: 7 },
      { key: "versatilidade", label: "Versatilidade", value: 6 },
    ],
    status: "provisorio",
    note: "Valores ilustrativos para validar o layout. Serão substituídos pelo teste editorial.",
  },
  seasons: { value: ["Outono", "Inverno"], status: "provisorio" },
  occasions: { value: ["Noite", "Encontros", "Eventos"], status: "provisorio" },
  verdict: {
    rating: { value: null, status: "provisorio", note: "Nota editorial em avaliação." },
    pros: {
      value: ["Âmbar e baunilha com coração floral luminoso", "Frasco triangular icônico e recarregável"],
      status: "provisorio",
      note: "Recarregável segundo a marca; a confirmar.",
    },
    cons: { value: ["Desempenho ainda não testado pela Zênite"], status: "provisorio" },
    profile: { value: "Quem procura um floral ambarado, quente e sofisticado para a noite.", status: "provisorio" },
    similar: { value: [], status: "provisorio", note: "Comparações em curadoria — serão geradas a partir do catálogo." },
  },
  theme: {
    deep: "#0a0210",
    mid: "#4a0f3f",
    glow: "#ff3d9a",
    accent: "#ffb3d1",
    stars: ["#ffffff", "#ffe3ef", "#ffc2dc", "#c79bff"],
    keyLight: "#fff0f6",
    rimLight: "#ff4fa3",
    fillLight: "#a65cff",
    nebula: [
      ["#4a0f3f", "#ff3d9a"],
      ["#3a0a3a", "#c04dff"],
      ["#2a0620", "#ffb3d1"],
      ["#5a1050", "#ffb3d1"],
      ["#4a0f4a", "#a65cff"],
    ],
    starTint: "#ffd6ea",
    dust: ["#ffc2dc", "#c79bff"],
    planet: ["#2a0624", "#a3326e", "#ff7fbf"],
    moon: ["#d9b4c9", "#ffe3ef", "#ffb3d1"],
    ambient: "#5a2f50",
  },
  look: {
    glass: { useTexture: false, tint: "#fff7f9", transmission: 1, thickness: 0.6, roughness: 0.03, attenuationColor: "#ffe8ee", attenuationDistance: 3, brightness: 1 },
    liquid: { color: "#ff6f86", surfaceColor: "#ffd6de", fill: 0.66 },
  },
};

/** Ordem da apresentação cinematográfica. */
export const featuredPerfumes: Perfume[] = [artOfUniverse, creedWildVetiver, pradaParadoxe];

/** Frascos do laboratório. */
export const bottles: BottleEntry[] = featuredPerfumes;

export function getPerfume(slug: string) {
  return featuredPerfumes.find((p) => p.slug === slug);
}
