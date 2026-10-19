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
}

export interface Perfume {
  slug: string;
  brand: string;
  line?: string;
  name: string;
  fullName: string;
  model: { desktop: string; mobile: string };
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
}
