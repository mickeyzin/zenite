import Link from "next/link";

export default function NotFound() {
  return (
    <main id="conteudo" className="catalog-page notfound-page">
      <p className="eyebrow">
        <span>✦</span> Erro 404
      </p>
      <h1 className="stage-title">Esta estrela não está no mapa</h1>
      <p className="review-method">A página que você procura não existe ou mudou de endereço.</p>
      <div className="flex flex-wrap gap-3 mt-6">
        <Link href="/catalogo" className="btn-primary">
          Ver o catálogo
        </Link>
        <Link href="/" className="btn-ghost">
          Página inicial
        </Link>
      </div>
    </main>
  );
}
