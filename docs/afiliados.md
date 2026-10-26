# Links de afiliado

## Automático (Amazon e lojas da Awin)

O site transforma o link comum da loja em link de afiliado na hora do clique, e marca a oferta como
"Link de afiliado" na resenha. Basta cadastrar a oferta com o link normal do produto.

Configure na Vercel: **Settings → Environment Variables** (ambiente *Production*), depois **Redeploy**.

| Variável | O que é | Exemplo |
|---|---|---|
| `AMAZON_ASSOCIATE_TAG` | Seu código de rastreamento do Amazon Associados (painel da Amazon → "IDs de rastreamento") | `zenite-20` |
| `AWIN_PUBLISHER_ID` | Seu número de afiliado (publisher) na Awin | `1234567` |
| `AWIN_MERCHANTS` | Lojas da Awin em que você foi aprovado: `site=número da loja`, separadas por vírgula | `epocacosmeticos.com.br=12345, belezanaweb.com.br=67890` |

Esses códigos não são senhas (aparecem em todo link divulgado), mas ficam fora do código e do chat.
Sem as variáveis, nada muda: os links continuam comuns.

## Mercado Livre (manual, mas em lote)

O link de afiliado do Mercado Livre só é gerado no painel de afiliados deles (formato curto
`mercadolivre.com/sec/…`). No painel da Zênite: **Ofertas → Colar vários links de uma vez**, uma oferta
por linha:

```
Lattafa Khamrah ; https://mercadolivre.com/sec/abc123 ; 249,90 ; 100
Afnan 9 PM ; https://mercadolivre.com/sec/def456 ; 199,00
```

Formato: `perfume ; link ; preço ; volume` (preço e volume opcionais; aceita `;`, `|` ou colar de uma
planilha). **Conferir** mostra o que foi reconhecido antes de salvar; linhas com erro não são gravadas.
A loja é reconhecida pelo link, e links do painel de afiliados são marcados como afiliado.
