import type { AccordKey } from "@/lib/olfactory";

/**
 * Guias de perfumaria (conteúdo editorial da Zênite). Informação geral, sem
 * números de desempenho inventados: onde há faixas, elas são aproximadas e
 * marcadas assim no texto.
 */
export type Block =
  | { type: "p"; text: string }
  | { type: "list"; items: string[] }
  | { type: "table"; head: string[]; rows: string[][]; caption: string }
  | { type: "tip"; text: string }
  | { type: "accords"; keys: AccordKey[] };

export interface Guide {
  slug: string;
  title: string;
  description: string;
  minutes: number;
  updated: string;
  sections: { h: string; blocks: Block[] }[];
  related: { label: string; href: string }[];
}

export const GUIDES: Guide[] = [
  {
    slug: "concentracoes-edt-edp-parfum",
    title: "EDT, EDP, Parfum: o que muda entre as concentrações",
    description:
      "Eau de Cologne, Eau de Toilette, Eau de Parfum e Extrait: o que cada nome indica, o que muda na pele e por que a concentração não diz tudo.",
    minutes: 5,
    updated: "2026-10-22",
    sections: [
      {
        h: "O que a concentração indica",
        blocks: [
          {
            type: "p",
            text: "O nome no rótulo indica, de forma aproximada, quanto do perfume é composto por óleos aromáticos — o restante é, em geral, álcool e um pouco de água. Quanto maior a proporção de óleos, mais denso tende a ser o perfume.",
          },
          {
            type: "table",
            caption: "Faixas aproximadas de óleos aromáticos. Não existe uma norma única: cada marca define as suas.",
            head: ["Nome no rótulo", "Faixa aproximada", "Como costuma se comportar"],
            rows: [
              ["Eau Fraîche / Splash", "até ~3%", "Leve e passageiro, para refrescar"],
              ["Eau de Cologne (EDC)", "~2% a 5%", "Fresco, geralmente cítrico, dura pouco"],
              ["Eau de Toilette (EDT)", "~5% a 15%", "Versátil, saída mais luminosa"],
              ["Eau de Parfum (EDP)", "~15% a 20%", "Mais encorpado, coração e fundo mais presentes"],
              ["Parfum / Extrait", "~20% a 30% ou mais", "Denso, costuma ficar mais perto da pele"],
            ],
          },
        ],
      },
      {
        h: "Mais concentrado não é sempre mais forte",
        blocks: [
          {
            type: "p",
            text: "A fixação e a projeção dependem muito das matérias-primas. Notas cítricas evaporam rápido em qualquer concentração; madeiras, âmbar, almíscar e baunilha permanecem por mais tempo. Por isso um EDT amadeirado pode durar mais na pele do que um EDP cítrico.",
          },
          {
            type: "p",
            text: "Também é comum a versão Extrait de um perfume ficar mais próxima da pele: mais rica e duradoura, porém com menos rastro. E versões de concentrações diferentes do mesmo nome muitas vezes têm fórmulas diferentes — não são só “o mesmo perfume mais forte”.",
          },
          { type: "tip", text: "Na hora de comparar preços, compare a mesma concentração e o mesmo volume. Um EDT e um EDP com o mesmo nome são produtos diferentes." },
        ],
      },
      {
        h: "Qual escolher",
        blocks: [
          {
            type: "list",
            items: [
              "Dias quentes e ambientes fechados: EDT ou EDC costumam ser mais confortáveis.",
              "Noite, frio ou quando você quer que dure o dia todo: EDP ou Extrait.",
              "Na dúvida, teste as duas versões na pele, em dias diferentes, antes de decidir.",
            ],
          },
        ],
      },
    ],
    related: [
      { label: "Ver perfumes Eau de Parfum no catálogo", href: "/catalogo?concentracao=Eau+de+Parfum" },
      { label: "Como testar perfume na pele", href: "/guias/como-testar-perfume" },
    ],
  },
  {
    slug: "familias-olfativas",
    title: "Famílias olfativas: um mapa para entender perfumes",
    description:
      "Cítrico, floral, amadeirado, ambarado, gourmand e mais: o que cada família lembra, quando costuma funcionar e como usar isso para escolher.",
    minutes: 6,
    updated: "2026-10-22",
    sections: [
      {
        h: "Família e acorde",
        blocks: [
          {
            type: "p",
            text: "Família olfativa é uma forma de agrupar perfumes pelo caráter principal. Quase todo perfume mistura várias: por isso, na Zênite, mostramos o perfil como uma combinação de acordes (por exemplo, “Amadeirado · Aromático · Verde”), estimada a partir da pirâmide declarada pela marca.",
          },
        ],
      },
      {
        h: "As principais famílias",
        blocks: [
          {
            type: "list",
            items: [
              "Cítrico — limão, bergamota, laranja, toranja. Fresco e luminoso; aparece muito na saída e evapora rápido.",
              "Floral — rosa, jasmim, flor de laranjeira, íris. Vai do delicado ao opulento; é a família mais ampla.",
              "Amadeirado — cedro, sândalo, vetiver, patchouli. Seco ou cremoso; dá estrutura e fixação.",
              "Ambarado (oriental) — âmbar, resinas, incenso, especiarias doces. Quente e envolvente.",
              "Doce / gourmand — baunilha, caramelo, cacau, café, fava-tonka. Lembra sobremesa; costuma fixar bem.",
              "Aromático — lavanda, alecrim, sálvia, menta. Herbal e limpo; comum em perfumes ditos masculinos.",
              "Especiado — pimenta, canela, cardamomo, cravo. Dá calor ou faísca, conforme a especiaria.",
              "Frutado — maçã, pera, frutas vermelhas, pêssego. Suculento e alegre.",
              "Verde — folhas, grama, chá verde, gálbano. Lembra planta recém-cortada.",
              "Almiscarado — almíscar e notas de “pele limpa”. Macio; prolonga os outros acordes.",
            ],
          },
          { type: "accords", keys: ["citrico", "floral", "amadeirado", "ambarado", "doce", "aromatico"] },
        ],
      },
      {
        h: "Famílias clássicas que você vai ver por aí",
        blocks: [
          {
            type: "list",
            items: [
              "Fougère — lavanda, cumarina (cheiro de feno, como na fava-tonka) e musgo. Base de muitos perfumes de barbearia.",
              "Chypre — contraste entre cítricos na saída e musgo de carvalho com patchouli no fundo.",
              "Aquático / marinho — notas que lembram mar e ar livre; populares em perfumes de verão.",
            ],
          },
        ],
      },
      {
        h: "Como usar isso para escolher",
        blocks: [
          {
            type: "p",
            text: "Pense em dois ou três perfumes de que você gosta e veja o que eles têm em comum no perfil. É comum descobrir que a família preferida não é a que você imaginava — alguém que “só gosta de perfume fresco” pode, na verdade, gostar de aromáticos com fundo amadeirado.",
          },
          { type: "tip", text: "O mapa olfativo da Zênite faz esse cruzamento por você: marque famílias e notas e veja os perfumes mais compatíveis do catálogo." },
        ],
      },
    ],
    related: [
      { label: "Fazer o mapa olfativo", href: "/mapa-olfativo" },
      { label: "Perfumes de perfil amadeirado", href: "/catalogo?perfil=Amadeirado" },
      { label: "Perfumes de perfil cítrico", href: "/catalogo?perfil=C%C3%ADtrico" },
    ],
  },
  {
    slug: "como-testar-perfume",
    title: "Como testar perfume na pele (e não se arrepender)",
    description: "Fita ou pele, quanto tempo esperar, quantos perfumes testar por vez e o que observar em cada fase antes de comprar.",
    minutes: 4,
    updated: "2026-10-22",
    sections: [
      {
        h: "Fita olfativa para triar, pele para decidir",
        blocks: [
          {
            type: "p",
            text: "A fita de papel mostra o perfume “puro” e serve para descartar rapidamente o que não agrada. Mas o perfume muda em contato com a pele — temperatura, oleosidade e até hidratação influenciam. Antes de comprar, teste sempre na pele.",
          },
        ],
      },
      {
        h: "Passo a passo",
        blocks: [
          {
            type: "list",
            items: [
              "Aplique uma borrifada no pulso ou na parte interna do braço, com a pele limpa e sem outro perfume.",
              "Não esfregue: deixe secar sozinho.",
              "Cheire logo no início (saída), depois de 15 a 30 minutos (coração) e algumas horas depois (fundo).",
              "Se puder, viva um dia com ele antes de decidir. A impressão dos primeiros minutos costuma ser a mais enganosa.",
            ],
          },
        ],
      },
      {
        h: "Quantos testar por vez",
        blocks: [
          {
            type: "p",
            text: "O nariz cansa rápido. Depois de três ou quatro perfumes, as diferenças ficam difíceis de perceber. Use lados diferentes do corpo para não misturar e, entre um teste e outro, cheire a própria pele sem perfume ou faça uma pausa ao ar livre.",
          },
          { type: "tip", text: "Anote o que sentiu em cada fase. Na resenha da Zênite, a seção “Evolução” mostra o que esperar da saída, do coração e do fundo." },
        ],
      },
    ],
    related: [
      { label: "Ver resenhas no catálogo", href: "/catalogo" },
      { label: "Como fazer o perfume durar mais", href: "/guias/como-fazer-perfume-durar-mais" },
    ],
  },
  {
    slug: "como-fazer-perfume-durar-mais",
    title: "Como fazer o perfume durar mais",
    description: "Onde aplicar, como preparar a pele, o que evitar e como guardar o frasco para o perfume render e durar mais.",
    minutes: 4,
    updated: "2026-10-22",
    sections: [
      {
        h: "Prepare a pele",
        blocks: [
          {
            type: "p",
            text: "Pele seca segura menos o perfume. Aplicar logo depois do banho, sobre um hidratante sem cheiro (ou da mesma linha do perfume), costuma aumentar a duração.",
          },
        ],
      },
      {
        h: "Onde aplicar",
        blocks: [
          {
            type: "list",
            items: [
              "Pontos quentes, onde há mais circulação: pescoço, atrás das orelhas, parte interna dos pulsos e dos cotovelos.",
              "Na roupa o perfume costuma durar mais, mas teste antes: alguns mancham tecidos claros ou delicados, como seda.",
              "No cabelo, prefira produtos próprios para cabelo — o álcool do perfume pode ressecar os fios.",
            ],
          },
        ],
      },
      {
        h: "O que evitar",
        blocks: [
          {
            type: "list",
            items: [
              "Esfregar os pulsos depois de aplicar: o atrito aquece a pele e tende a acelerar a saída das notas mais leves.",
              "Exagerar na quantidade para “compensar”: perfume demais incomoda quem está por perto e não necessariamente dura mais.",
            ],
          },
        ],
      },
      {
        h: "Como guardar o frasco",
        blocks: [
          {
            type: "p",
            text: "Luz, calor e variação de temperatura alteram o perfume com o tempo. Guarde o frasco fechado, longe da janela e de fontes de calor — o banheiro, com vapor e calor do banho, costuma ser o pior lugar. A caixa original é uma ótima proteção.",
          },
          { type: "tip", text: "Se a fixação é prioridade, prefira perfumes com fundo amadeirado, ambarado ou baunilhado. Veja no catálogo pelo perfil." },
        ],
      },
    ],
    related: [
      { label: "Perfumes de perfil ambarado", href: "/catalogo?perfil=Ambarado" },
      { label: "Entenda as concentrações", href: "/guias/concentracoes-edt-edp-parfum" },
    ],
  },
];

export const getGuide = (slug: string) => GUIDES.find((g) => g.slug === slug) ?? null;
