import Image from "next/image";
import { ACCORD_COLOR, Icon } from "@/components/ui/Icons";
import { ACCORDS, normalize, NOTE_ACCORDS, type AccordKey } from "@/lib/olfactory";

type Weights = Partial<Record<string, number>>;

/** Acordes de uma nota, do mais forte para o mais fraco. */
export function noteAccordKeys(note: string, override?: Record<string, Weights>): AccordKey[] {
  const w = override?.[normalize(note)] ?? NOTE_ACCORDS[normalize(note)];
  if (!w) return [];
  return (Object.entries(w) as [AccordKey, number][])
    .sort((a, b) => (b[1] ?? 0) - (a[1] ?? 0))
    .map(([k]) => k);
}

/**
 * Nota como um pequeno planeta: cor e ícone do acorde principal, brilho do
 * segundo acorde. Com imagem enviada pelo painel, a foto ocupa o orbe.
 */
export function NoteOrb({
  note,
  override,
  image,
  className = "",
  style,
}: {
  note: string;
  override?: Record<string, Weights>;
  image?: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const keys = noteAccordKeys(note, override);
  const main = keys[0];
  const c1 = main ? ACCORD_COLOR[main] : "#8fa3c9";
  const c2 = keys[1] ? ACCORD_COLOR[keys[1]] : c1;
  const labels = keys.slice(0, 2).map((k) => ACCORDS.find((a) => a.key === k)!.label);
  return (
    <li className={`note-orb ${className}`} style={style}>
      <span className={`note-orb-ball ${image ? "has-img" : ""}`} style={{ ["--c1" as string]: c1, ["--c2" as string]: c2 }} aria-hidden>
        {image ? <Image src={image} alt="" width={96} height={96} /> : <Icon name={main ?? "sparkle"} size={26} />}
      </span>
      <span className="note-orb-name">{note}</span>
      {labels.length > 0 && <span className="note-orb-acc">{labels.join(" · ")}</span>}
    </li>
  );
}
