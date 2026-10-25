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
        <p className="review-method">Última atualização: 25 de outubro de 2026.</p>
      </header>

      <section>
        <h2>O que a Zênite coleta</h2>
        <ul>
          <li>
            <strong>Conta só se você quiser.</strong> Para ler resenhas, comparar e fazer o mapa olfativo não é preciso conta.
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
        <h2>Conta (opcional)</h2>
        <ul>
          <li>
            Criar conta é opcional. Com ela guardamos <strong>só</strong>: seu e-mail (para o link de acesso), o nome que você
            escolher, seu mapa olfativo, o seu armário e, se autorizar, sinais de uso (perfumes que você marcou como “tenho”, “gostei”, “não gostei” ou “quero
            experimentar”).
          </li>
          <li>Esses dados são visíveis apenas para você. Nem outros visitantes nem outras contas conseguem ver.</li>
          <li>
            Em “Minha conta” você pode sair, corrigir os dados e <strong>apagar a conta</strong>: o perfil e o armário são
            apagados junto, na hora.
          </li>
          <li>
            <strong>Aprender com o uso (opcional, desligado por padrão).</strong> Só se você autorizar, registramos na sua conta as
            resenhas que você lê com calma, as comparações, os cliques em ofertas e as notas que você pesquisa no catálogo — para
            afinar as recomendações em “Para você”. Não registramos o que não é sobre perfumes.
          </li>
          <li>
            Esses sinais são visíveis só para você em “Minha conta”, perdem peso com o tempo e são apagados após 180 dias. Desligar
            a autorização ou clicar em “Apagar histórico” apaga tudo na hora.
          </li>
        </ul>
      </section>

      <section>
        <h2>Mapa olfativo</h2>
        <ul>
          <li>Sem conta, as respostas do quiz ficam só no seu navegador. Com conta, você escolhe salvá-las no seu perfil.</li>
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
          Pela Lei Geral de Proteção de Dados (LGPD), você pode ver, corrigir e apagar seus dados. Tudo o que guardamos sobre a sua
          conta aparece em “Minha conta”, onde também está o botão para apagar tudo.
        </p>
      </section>
    </main>
  );
}
