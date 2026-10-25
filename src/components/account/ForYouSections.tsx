"use client";

import Image from "next/image";
import Link from "next/link";
import { ACCORD_COLOR } from "@/components/ui/Icons";
import { PerfumeArt } from "@/components/ui/PerfumeArt";
import { accordProfile, topAccords } from "@/lib/olfactory";
import type { Pick, Section, WardrobeStatus } from "@/lib/recommend";

/** Seções de recomendação ("Para você") dentro do perfil. */
export function ForYouSections({ sections, onMark }: { sections: Section[]; onMark: (slug: string, s: WardrobeStatus) => void }) {
  return (
    <div className="foryou">
      {sections.map((s) => (
        <section key={s.key} className="foryou-section" aria-labelledby={`fy-${s.key}`}>
          <h3 id={`fy-${s.key}`}>{s.title}</h3>
          <p className="admin-muted">{s.subtitle}</p>
          {s.picks.length ? (
            <ul className={`foryou-grid ${s.key === "top" ? "is-hero" : ""}`}>
              {s.picks.map((pick, i) => (
                <PickCard key={`${pick.perfume.slug}-${i}`} pick={pick} hero={s.key === "top"} onMark={onMark} />
              ))}
            </ul>
          ) : (
            <p className="admin-muted">{s.empty ?? "Nada por aqui ainda — o catálogo está crescendo."}</p>
          )}
        </section>
      ))}
      <p className="admin-muted foryou-note">
        Sugestões estimadas a partir das notas declaradas de cada perfume. Teste na pele antes de comprar.
      </p>
    </div>
  );
}

function PickCard({
  pick: { perfume: p, score, reason },
  hero,
  onMark,
}: {
  pick: Pick;
  hero: boolean;
  onMark: (slug: string, s: WardrobeStatus) => void;
}) {
  const offer = p.offers?.find((o) => o.available && o.price !== null);
  const main = topAccords(accordProfile(p).profile, 1)[0];
  const pct = Math.round(score * 100);
  return (
    <li
      className={`foryou-card ${hero ? "is-hero" : ""}`}
      style={{ "--acc": main ? ACCORD_COLOR[main.key] : "#31c7f3" } as React.CSSProperties}
    >
      <Link href={`/perfumes/${p.slug}`} className="foryou-img" tabIndex={-1} aria-hidden>
        {p.poster ? <Image src={p.poster} alt="" width={360} height={440} /> : <PerfumeArt perfume={p} className="poster-art" />}
      </Link>
      <div className="foryou-body">
        <p className="foryou-score">
          <span className="foryou-meter" aria-hidden>
            <span style={{ width: `${pct}%` }} />
          </span>
          Afinidade {pct}%
        </p>
        <h4>
          <Link href={`/perfumes/${p.slug}`}>{p.fullName}</Link>
        </h4>
        <p className="foryou-reason">{reason}</p>
        {offer && (
          <p className="foryou-offer">
            a partir de {offer.price!.toLocaleString("pt-BR", { style: "currency", currency: offer.currency })} · {offer.store}
          </p>
        )}
        <div className="foryou-actions">
          <button type="button" className="admin-link" onClick={() => onMark(p.slug, "nao_gostei")}>
            Não é pra mim
          </button>
          <button type="button" className="admin-link" onClick={() => onMark(p.slug, "tenho")}>
            Já tenho
          </button>
          <button type="button" className="admin-link" onClick={() => onMark(p.slug, "quero")}>
            Quero experimentar
          </button>
        </div>
      </div>
    </li>
  );
}
