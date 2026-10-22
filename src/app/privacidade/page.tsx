import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacidade e afiliados",
  description: "Como a Zênite trata dados, como funcionam os links de afiliado e o que acontece no mapa olfativo com IA.",
  alternates: { canonical: "/privacidade" },
};

export default function PrivacidadePage() {
  return (
    <main id="conteudo" className="catalog-page legal-page">
      <header className="catalog-head">
        <p className="eyebrow">
          <span>✦</span> Transparência
        </p>
        <h1 className="stage-title">Privacidade e afiliados</h1>
        <p className="review-method">Última atualização: outubro de 2026.</p>
      </header>

      <section>
        <h2>O que a Zênite coleta</h2>
        <ul>
          <li>
            <strong>Nenhum cadastro de visitantes.</strong> Para ler resenhas, comparar e fazer o mapa olfativo não é preciso conta.
          </li>
          <li>
            <strong>Cliques em ofertas.</strong> Quando você clica em “Ver oferta”, registramos só qual oferta, o horário e a página
            de origem — sem nome, e-mail ou endereço IP na base da Zênite — para saber quais lojas são úteis aos leitores.
          </li>
          <li>
            <strong>Cookies.</strong> O site não usa cookies de rastreamento nem de publicidade. O painel administrativo guarda a
            sessão de login no navegador de quem administra.
          </li>
        </ul>
      </section>

      <section>
        <h2>Mapa olfativo</h2>
        <ul>
          <li>As respostas do quiz ficam no seu navegador e não são enviadas para a Zênite.</li>
          <li>
            Se você usar a etapa “Descreva com suas palavras”, o texto digitado é enviado à <strong>OpenAI</strong> apenas para ser
            interpretado em famílias e notas. A Zênite não guarda esse texto. Não escreva dados pessoais nesse campo.
          </li>
          <li>
            Para evitar abuso, o servidor conta por até uma hora quantas consultas à IA vieram do mesmo endereço de rede; essa
            contagem fica só na memória e não é gravada.
          </li>
        </ul>
      </section>

      <section>
        <h2>Links de afiliado</h2>
        <ul>
          <li>
            Algumas ofertas usam links de afiliado (por exemplo, do programa de afiliados do Mercado Livre). Se você comprar por
            eles, a Zênite pode receber uma comissão, <strong>sem custo extra para você</strong>.
          </li>
          <li>Todo link de afiliado é identificado com a etiqueta “Link de afiliado”.</li>
          <li>
            Comissões não influenciam a avaliação editorial nem a ordem das ofertas: elas aparecem da mais barata para a mais cara
            entre as que têm preço conferido recentemente.
          </li>
          <li>Preços são conferidos manualmente e exibidos com a data; preços com mais de 3 dias deixam de aparecer.</li>
        </ul>
      </section>

      <section>
        <h2>Serviços usados</h2>
        <ul>
          <li>Vercel — hospedagem do site.</li>
          <li>Supabase — banco de dados do catálogo e das ofertas.</li>
          <li>OpenAI — interpretação de texto no mapa olfativo (só quando você usa essa etapa).</li>
        </ul>
      </section>

      <section>
        <h2>Seus direitos</h2>
        <p>
          Pela Lei Geral de Proteção de Dados (LGPD), você pode pedir informações sobre dados tratados pela Zênite. Como não
          mantemos cadastro de visitantes, em geral não há dados pessoais seus guardados aqui.
        </p>
      </section>
    </main>
  );
}
