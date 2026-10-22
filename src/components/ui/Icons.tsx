import type { AccordKey } from "@/lib/olfactory";

/**
 * Ícones da Zênite: traço fino, 24×24, herdam a cor do texto (currentColor).
 * Decorativos por padrão (aria-hidden): o texto ao lado sempre diz o mesmo.
 */
const PATHS = {
  // Desempenho
  clock: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm0 4v5l3.5 2",
  waves: "M3 9c2-2 4-2 6 0s4 2 6 0 4-2 6 0M3 15c2-2 4-2 6 0s4 2 6 0 4-2 6 0",
  gauge: "M4 17a8 8 0 1 1 16 0M12 17l4-6M7 17h.01M17 17h.01",
  compass: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm3.5 5.5-2 5-5 2 2-5 5-2Z",
  // Características
  drop: "M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11Z",
  breeze: "M3 8h11a3 3 0 1 0-3-3M3 12h16a3 3 0 1 1-3 3M3 16h7",
  // Estações e momento
  snowflake: "M12 2v20M4.9 6.5l14.2 11M4.9 17.5l14.2-11M9 4l3 2 3-2M9 20l3-2 3 2",
  blossom: "M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6ZM12 9c0-3 1.5-5 0-6-1.5 1 0 3 0 6Zm0 6c0 3-1.5 5 0 6 1.5-1 0-3 0-6Zm3-3c3 0 5 1.5 6 0-1-1.5-3 0-6 0Zm-6 0c-3 0-5-1.5-6 0 1 1.5 3 0 6 0Z",
  sun: "M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8ZM12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4",
  leafFall: "M5 19c0-8 6-14 15-14 0 9-6 15-14 15M5 19l7-7",
  moon: "M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5Z",
  // Ocasiões
  briefcase: "M4 8h16v11H4zM9 8V5h6v3M4 13h16",
  glass: "M7 3h10l-1 7a4 4 0 0 1-8 0L7 3ZM12 14v6M8 21h8",
  heart: "M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.5-7 10-7 10Z",
  home: "M4 11l8-7 8 7v9H4zM10 20v-5h4v5",
  star: "M12 3l2.6 5.6 6.1.7-4.5 4.1 1.2 6-5.4-3-5.4 3 1.2-6-4.5-4.1 6.1-.7L12 3Z",
  sparkle: "M12 3l1.8 6.2L20 11l-6.2 1.8L12 19l-1.8-6.2L4 11l6.2-1.8L12 3Z",
  // Dados
  tag: "M3 12V4h8l10 10-8 8L3 12ZM7.5 7.5h.01",
  calendar: "M4 6h16v14H4zM4 10h16M8 3v4M16 3v4",
  user: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM4 21a8 8 0 0 1 16 0",
  users: "M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM2 20a7 7 0 0 1 14 0M16 4.5a3.5 3.5 0 0 1 0 6.5M18 13.5a6 6 0 0 1 4 6.5",
  bottle: "M9 3h6v3H9zM8 6h8l2 4v10H6V10l2-4ZM6 13h12",
  layers: "M12 3l9 5-9 5-9-5 9-5ZM3 13l9 5 9-5",
  // Pirâmide
  up: "M12 19V5M6 11l6-6 6 6",
  core: "M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8ZM12 2v3M12 19v3M2 12h3M19 12h3",
  roots: "M12 3v9M12 12c-3 2-5 5-5 9M12 12c3 2 5 5 5 9M12 12v9",
  // Acordes (usados nos orbes das notas)
  citrico: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm0 0v18M3 12h18M5.6 5.6l12.8 12.8M18.4 5.6 5.6 18.4",
  floral: "M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6ZM12 9C10 5 12 3 12 3s2 2 0 6Zm3 3c4-2 6 0 6 0s-2 2-6 0Zm-3 3c2 4 0 6 0 6s-2-2 0-6Zm-3-3c-4 2-6 0-6 0s2-2 6 0Z",
  verde: "M5 19c0-8 6-14 15-14 0 9-6 15-14 15M5 19l8-8",
  aromatico: "M12 21V9M12 13c-3 0-5-2-5-5 3 0 5 2 5 5Zm0-4c3 0 5-2 5-5-3 0-5 2-5 5Zm0 8c3 0 5-2 5-5-3 0-5 2-5 5Z",
  especiado: "M12 3l2 5 5-2-2 5 5 2-5 2 2 5-5-2-2 5-2-5-5 2 2-5-5-2 5-2-2-5 5 2 2-5Z",
  amadeirado: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm0 4a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm0 3.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Z",
  ambarado: "M12 3l7 5-2.7 10H7.7L5 8l7-5ZM5 8h14M12 3 9 8l3 10 3-10-3-5Z",
  doce: "M7 10a5 5 0 0 1 10 0v1H7v-1ZM6 11h12l-2 9H8l-2-9ZM12 5V3",
  frutado: "M12 8c-4-2-8 1-7 6s4 7 7 6c3 1 6-1 7-6s-3-8-7-6ZM12 8c0-2 1-4 3-5",
  almiscarado: "M7 17a4 4 0 0 1 0-8 5 5 0 0 1 9.6-1.5A4 4 0 1 1 17 17H7Z",
} as const;

export type IconName = keyof typeof PATHS;

export function Icon({ name, size = 20, className, label }: { name: IconName; size?: number; className?: string; label?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={`zicon ${className ?? ""}`}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={label ? undefined : true}
      role={label ? "img" : undefined}
      aria-label={label}
    >
      <path d={PATHS[name]} />
    </svg>
  );
}

/** Cor de cada acorde (mesma da arte automática dos perfumes). */
export const ACCORD_COLOR: Record<AccordKey, string> = {
  citrico: "#f2c94c",
  frutado: "#ff7a8a",
  floral: "#f29bd4",
  verde: "#6fcf7f",
  aromatico: "#6fd6c8",
  especiado: "#e0763c",
  amadeirado: "#c08a5a",
  ambarado: "#e3a03a",
  doce: "#d98ad9",
  almiscarado: "#b9b4ea",
};

/** Ícone por métrica (desempenho e características). */
export const METRIC_ICON: Record<string, IconName> = {
  fixacao: "clock",
  projecao: "waves",
  intensidade: "gauge",
  versatilidade: "compass",
  docura: "doce",
  frescor: "breeze",
  amadeirado: "amadeirado",
  especiado: "especiado",
};

const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

/** Ícone para uma ocasião em texto livre ("Encontros casuais", "Trabalho"…). */
export function occasionIcon(s: string): IconName {
  const t = norm(s);
  if (/trabalho|escritorio|profission/.test(t)) return "briefcase";
  if (/noite|festa|balada|evento/.test(t)) return "glass";
  if (/encontro|romant|date/.test(t)) return "heart";
  if (/dia a dia|casual|cotidian/.test(t)) return "home";
  if (/elegante|formal|especia/.test(t)) return "star";
  if (/dia\b|manha/.test(t)) return "sun";
  return "sparkle";
}

export const SEASONS: { key: string; label: string; icon: IconName }[] = [
  { key: "primavera", label: "Primavera", icon: "blossom" },
  { key: "verao", label: "Verão", icon: "sun" },
  { key: "outono", label: "Outono", icon: "leafFall" },
  { key: "inverno", label: "Inverno", icon: "snowflake" },
];
export const normSeason = norm;
