import Link from "next/link";
import type { Block, Guide } from "@/data/guides";
import type { Perfume } from "@/data/types";
import { ACCORDS, accordProfile, topAccords } from "@/lib/olfactory";

/** Corpo do guia. O bloco "accords" mostra exemplos reais do catálogo. */
export function GuideBody({ guide, catalog }: { guide: Guide; catalog: Perfume[] }) {
  return (
    <>
      {guide.sections.map((s) => (
        <section key={s.h} className="guide-section">
          <h2>{s.h}</h2>
          {s.blocks.map((b, i) => (
            <BlockView key={i} block={b} catalog={catalog} />
          ))}
        </section>
      ))}
    </>
  );
}

function BlockView({ block: b, catalog }: { block: Block; catalog: Perfume[] }) {
  if (b.type === "p") return <p>{b.text}</p>;
  if (b.type === "tip") return <p className="guide-tip">{b.text}</p>;
  if (b.type === "list")
    return (
      <ul>
        {b.items.map((t) => {
          const [head, ...rest] = t.split(" — ");
          return <li key={t}>{rest.length ? (<><strong>{head}</strong> — {rest.join(" — ")}</>) : t}</li>;
        })}
      </ul>
    );
  if (b.type === "table")
    return (
      <div className="guide-table-wrap">
        <table className="guide-table">
          <caption>{b.caption}</caption>
          <thead>
            <tr>
              {b.head.map((h) => (
                <th key={h} scope="col">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {b.rows.map((r) => (
              <tr key={r[0]}>
                {r.map((c, i) => (i === 0 ? <th key={i} scope="row">{c}</th> : <td key={i} data-label={b.head[i]}>{c}</td>))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  // Exemplos do catálogo cujo acorde predominante é o indicado.
  const lead = catalog.map((p) => ({ p, top: topAccords(accordProfile(p).profile, 1)[0]?.key }));
  return (
    <div className="guide-examples">
      <p className="guide-examples-title">Exemplos no catálogo da Zênite</p>
      <ul>
        {b.keys.map((k) => {
          const label = ACCORDS.find((a) => a.key === k)!.label;
          const ex = lead.filter((x) => x.top === k).slice(0, 2);
          return (
            <li key={k}>
              <Link href={`/catalogo?perfil=${encodeURIComponent(label)}`}>{label}</Link>
              {ex.length > 0 && (
                <span>
                  {" "}
                  — {ex.map((x, i) => (
                    <span key={x.p.slug}>
                      {i > 0 && ", "}
                      <Link href={`/perfumes/${x.p.slug}`}>{x.p.fullName}</Link>
                    </span>
                  ))}
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
