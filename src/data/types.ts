/**
 * Status de cada bloco de informação. A interface exibe esse status ao leitor,
 * para separar dado oficial/verificado, dado a confirmar e conteúdo provisório.
 */
export type DataStatus = "verificado" | "a-confirmar" | "provisorio";

export interface Sourced<T> {
  value: T;
  status: DataStatus;
  note?: string;
  sources?: { label: string; url: string }[];
}

export interface Metric {
  key: string;
  label: string;
  /** 0–10. `null` = ainda não avaliado. */
  value: number | null;
}

export interface UniverseTheme {
  /** Cores da nebulosa, do fundo para o brilho. */
  deep: string;
  mid: string;
  glow: string;
  accent: string;
  stars: string[];
  keyLight: string;
  rimLight: string;
  fillLight: string;
  /** Pares [cor de fundo, cor de brilho] das 5 camadas de nebulosa. */
  nebula: [string, string][];
  /** Tom aplicado às estrelas. */
  starTint: string;
  /** [cor 1, cor 2] da poeira cósmica. */
  dust: [string, string];
  /** Planeta grande e lua: [cor A, cor B, atmosfera]. */
  planet: [string, string, string];
  moon: [string, string, string];
  ambient: string;
}

/** Ajustes visuais das peças separadas do frasco (ver scripts/models). */
export interface BottleLook {
  /** Corpo opaco (frascos laqueados/pintados, ex.: Art of Universe). */
  body?: { color: string; roughness: number; clearcoat: number };
  /** Placa metálica: <1 deixa o metal mais acetinado/claro (menos espelho). */
  plate?: { metalness: number; roughness: number };
  glass?: {
    /**
     * true: o vidro usa a cor da textura (vidro tingido).
     * false: vidro incolor com `tint`; útil quando a cor da textura é do líquido
     * visto através do vidro (Creed, Prada).
     */
    useTexture: boolean;
    tint: string;
    /** 0 = opaco (como o GLB original), 1 = totalmente transmissivo. */
    transmission: number;
    thickness: number;
    roughness: number;
    attenuationColor: string;
    attenuationDistance: number;
    /** Multiplica a cor da textura no vidro (>1 clareia o tom transmitido). */
    brightness: number;
  };
  liquid?: {
    color: string;
    surfaceColor: string;
    /** Fração do volume interno ocupada pelo líquido (0–1). */
    fill: number;
  };
}

/** Dados mínimos para exibir um frasco (laboratório e cenas). */
export interface BottleModel {
  desktop: string;
  mobile: string;
  /** Pontos que preenchem o volume do líquido (scripts/models). */
  liquid?: string;
}

export interface BottleEntry {
  slug: string;
  name: string;
  model: BottleModel;
  theme: UniverseTheme;
  look: BottleLook;
}

export interface Perfume {
  slug: string;
  brand: string;
  line?: string;
  name: string;
  fullName: string;
  /** Nome do universo exibido na abertura (ex.: "Universo azul"). */
  universe: string;
  model: BottleModel;
  /** Imagem estática (modo sem WebGL e página de resenha). */
  poster: string | null;
  /** Escala do frasco na cena (frascos largos, como o Prada, ficam menores). */
  sceneScale: number;
  perfumers: Sourced<string[] | null>;
  /** Rotação (rad) que coloca a face frontal do frasco para a câmera. */
  frontRotationY: number;
  concentration: Sourced<string>;
  family: Sourced<string>;
  year: Sourced<string | null>;
  gender: Sourced<string>;
  intro: Sourced<string>;
  notes: Sourced<{ top: string[]; heart: string[]; base: string[] }>;
  evolution: Sourced<{ phase: string; text: string }[]>;
  performance: Sourced<Metric[]>;
  seasons: Sourced<string[]>;
  occasions: Sourced<string[]>;
  verdict: {
    rating: Sourced<number | null>;
    pros: Sourced<string[]>;
    cons: Sourced<string[]>;
    profile: Sourced<string>;
    similar: Sourced<{ name: string; reason: string }[]>;
  };
  theme: UniverseTheme;
  look: BottleLook;
  /**
   * Pesos de acordes das notas deste perfume vindos do banco (chave = nome
   * normalizado). Sem isso, vale o dicionário local data/note-accords.json.
   */
  noteWeights?: Record<string, Record<string, number>>;
}
