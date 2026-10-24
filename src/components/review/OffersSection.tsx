import Image from "next/image";
import { Icon } from "@/components/ui/Icons";
import { PerfumeArt } from "@/components/ui/PerfumeArt";
import type { Offer, Perfume } from "@/data/types";

const money = (v: number, currency: string) => v.toLocaleString("pt-BR", { style: "currency", currency });
const when = (iso: string) =>
  new Date(iso).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit", timeZone: "America/Sao_Paulo" });

/** Menor preço confirmado entre as ofertas disponíveis. */
export const bestPrice = (p: Perfume) => p.offers?.find((o) => o.available && o.price !== null) ?? null;

/**
 * Ofertas. Regras: nunca exibir preço sem data de conferência; preço antigo some
 * (pode ter mudado); todo link de afiliado é identificado; os cliques passam por
 * /oferta/[id] (contagem anônima) com rel="sponsored".
 */
export function OffersSection({ perfume: p }: { perfume: Perfume }) {
  const offers = p.offers ?? [];
  const best = bestPrice(p);
  const anyAffiliate = offers.some((o) => o.isAffiliate);
  return (
    <section id="ofertas" className="review-section" aria-labelledby="ofertas-t">
      <h2 id="ofertas-t">Ofertas</h2>
      {offers.length === 0 ? (
        <p className="text-[var(--z-muted)]">
          Ainda não há ofertas cadastradas. Quando houver, mostraremos lojas parceiras com links de afiliado identificados e a data
          da última atualização de preço.
        </p>
      ) : (
        <>
          {anyAffiliate && (
            <p className="offers-disclosure">
              <strong>Links de afiliado:</strong> se você comprar por eles, a Zênite pode receber uma comissão, sem custo extra para
              você. Isso não muda nossa avaliação.
            </p>
          )}
          <ul className="offers-list">
            {offers.map((o) => (
              <OfferRow key={o.id} offer={o} isBest={o === best} perfume={p} />
            ))}
          </ul>
          <p className="text-[var(--z-muted)] text-sm">
            Preços e disponibilidade mudam com frequência; o valor final é o exibido na loja. Preços conferidos há mais de 3 dias não
            são mostrados.
          </p>
        </>
      )}
    </section>
  );
}

const isML = (o: Offer) => /mercado/i.test(o.storeSlug || o.store);

function OfferRow({ offer: o, isBest, perfume: p }: { offer: Offer; isBest: boolean; perfume: Perfume }) {
  const img = o.image ?? p.poster;
  return (
    <li className={`offer ${isBest ? "is-best" : ""} ${o.available ? "" : "is-off"}`}>
      <div className="offer-img">
        {img ? <Image src={img} alt="" width={240} height={240} /> : <PerfumeArt perfume={p} className="poster-art" />}
        {!o.image && <span className="offer-img-note">Ilustrativa</span>}
      </div>
      <div className="offer-main">
        <p className="offer-store">
          <span className={`offer-badge ${isML(o) ? "is-ml" : ""}`}>{o.store}</span>
          {isBest && <span className="offer-tag offer-tag-best">Menor preço</span>}
          {o.isAffiliate && <span className="offer-tag">Link de afiliado</span>}
        </p>
        <p className="offer-title">
          {o.title}
          {o.volumeMl ? ` · ${o.volumeMl} ml` : ""}
        </p>
        <ul className="offer-facts">
          {o.shipping && (
            <li>
              <Icon name="truck" size={14} /> {o.shipping}
            </li>
          )}
          {o.seller && (
            <li>
              <Icon name="medal" size={14} /> Vendedor: {o.seller}
            </li>
          )}
        </ul>
      </div>
      <div className="offer-side">
        <div className="offer-price">
          {!o.available ? (
            <span className="text-[var(--z-muted)]">Indisponível no momento</span>
          ) : o.price !== null ? (
            <>
              <strong>{money(o.price, o.currency)}</strong>
              {o.checkedAt && <span>conferido em {when(o.checkedAt)}</span>}
            </>
          ) : (
            <span className="text-[var(--z-muted)]">Preço na loja</span>
          )}
        </div>
        {o.available && (
          <a
            href={`/oferta/${o.id}`}
            className={isBest ? "btn-primary" : "btn-ghost"}
            rel={`nofollow noopener${o.isAffiliate ? " sponsored" : ""}`}
            target="_blank"
          >
            {isBest ? "Ver melhor oferta" : "Ver oferta"}
            <span className="sr-only"> em {o.store} (abre em nova aba)</span>
          </a>
        )}
      </div>
    </li>
  );
}
