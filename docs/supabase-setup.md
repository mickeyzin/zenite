# Ligar o Supabase à Zênite

Passo a passo para conectar o projeto **zenite** do Supabase ao site e ao painel `/admin`.
Leva uns 10 minutos. Nada aqui exige colar senha ou chave em chat.

> Enquanto o banco não estiver ligado, o site continua funcionando com os dados locais
> (`src/data/perfumes.ts`). Ao ligar, ele passa a ler do banco, e volta aos dados locais
> sozinho se o banco ficar fora do ar.

## 1. Criar as tabelas e as regras de segurança

No painel do Supabase: **SQL Editor → New query**.

1. Cole o conteúdo de [`supabase/migrations/0001_init.sql`](../supabase/migrations/0001_init.sql) e clique em **Run**.
   Cria tabelas, regras de acesso (RLS), o histórico de alterações e o espaço de imagens `perfumes`.
   Pode rodar de novo sem problema: o script não apaga nada.
2. Nova query: cole [`supabase/seed.sql`](../supabase/seed.sql) e clique em **Run**.
   Carrega os 10 acordes, 209 notas com seus apelidos, as marcas, os 3 perfumes da apresentação
   e os 64 rascunhos importados do site da Lattafa (para revisar no painel).

3. Atualizações do banco: rode também, na ordem, os arquivos seguintes de `supabase/migrations/`
   (por exemplo `0002_note_images.sql`, que adiciona as imagens das notas). Todos podem rodar mais de uma vez.

## 2. Criar a sua conta de administrador

1. **Authentication → Users → Add user → Create new user**: seu e-mail e uma senha forte.
   Marque **Auto Confirm User**.
2. **SQL Editor**, nova query (troque pelo seu e-mail):

   ```sql
   insert into public.admins (user_id)
   select id from auth.users where email = 'seu-email@exemplo.com';
   ```

3. **Authentication → Sign In / Providers**: desligue **Allow new users to sign up**.
   O painel só tem login; ninguém precisa criar conta.

> Só quem está na tabela `admins` consegue alterar dados. Qualquer outra conta, mesmo
> logada, vê o mesmo que um visitante: perfumes publicados.

## 3. Pegar o endereço e a chave pública

**Project Settings → API Keys** (ou **Data API**):

- **Project URL**: `https://<id-do-projeto>.supabase.co`
- **Publishable key** (`sb_publishable_…`) ou, em projetos antigos, a **anon public** key.

Essa chave é pública: ela vai para o navegador e só permite o que as regras do banco deixam.
**Nunca use a `secret` / `service_role` key no site.**

## 4. Colocar as variáveis no ambiente

| Variável | Valor |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | o Project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | a publishable key (ou use `NEXT_PUBLIC_SUPABASE_ANON_KEY` com a anon key) |

- **No ambiente do Claude Code**: menu do ambiente na barra de título da sessão → **Edit** →
  variáveis de ambiente. Em **allowed domains**, inclua `<id-do-projeto>.supabase.co`
  (ou `*.supabase.co`). Uma sessão nova já enxerga as variáveis.
- **Na hospedagem** (Vercel, na fase de deploy): as mesmas duas variáveis em
  *Settings → Environment Variables*.
- **Local**: um arquivo `.env.local` na raiz (já ignorado pelo git).

Depois de configurar, publique/rode o build de novo: as variáveis `NEXT_PUBLIC_*` entram no build.

## 5. Usar o painel

Abra `/admin` e entre com o e-mail e a senha do passo 2.

- **Importados** — dados tirados dos sites oficiais. Confira com a página de origem e aprove
  (um a um ou em lote). Aprovar cria o perfume como **rascunho**: ainda não aparece no site.
- **Perfumes** — publicar, despublicar, destacar e editar. A edição separa **fatos** (com situação:
  verificado, a confirmar, provisório) da **avaliação editorial**. A pirâmide aceita nomes em português
  ou inglês; notas novas são criadas e vão para a aba Notas. Pôster: só imagem própria ou autorizada,
  com crédito obrigatório.
- **Notas** — classificar notas novas em acordes (pesos de 0 a 1). Isso alimenta o perfil olfativo
  estimado e a semelhança entre perfumes.
- **Ofertas** — cadastro manual por enquanto; ainda não aparecem no site. Na fase de afiliados,
  os preços do Mercado Livre virão da API oficial.

Ao salvar algo público, o painel pede ao site para atualizar o cache (rota `/api/revalidar`,
que só aceita administradores). Se não conseguir, o site se atualiza sozinho em até 1 hora.

## Como foi testado

- `npm run db:test` — migração e seed num Postgres embutido, com 28 verificações de permissão
  (visitante, usuário comum e admin).
- `npm run db:test:roundtrip` — dados locais → banco → site devolvem exatamente os mesmos perfumes.
- Teste de navegador do painel inteiro (login, aprovação, publicação, edição, notas, ofertas e o
  perfume aparecendo no catálogo) contra Postgres 16 + PostgREST locais, com um login simulado.
  O login real do Supabase (GoTrue) e o envio de imagem para o Storage real só serão
  conferidos com o projeto conectado.

## Notas

- O dicionário `data/note-accords.json` serviu de base para o seed. Com o banco ligado, a fonte
  das classificações passa a ser o banco (aba Notas).
- Para gerar o seed de novo depois de mudar os dados locais: `npm run db:seed:build`.

## Contas de visitantes (perfil e armário)

1. **SQL Editor:** rode `supabase/migrations/0004_user_profiles.sql`.
2. **Authentication → Sign In / Providers:** ligue **Allow new users to sign up** de novo e deixe **Email** ativo.
   Isso é seguro: só quem está na tabela `admins` altera dados do site; contas comuns só veem o próprio perfil e armário.
3. **Authentication → URL Configuration:**
   - **Site URL:** `https://zenite-orpin.vercel.app` (ou o seu domínio)
   - **Redirect URLs:** adicione `https://zenite-orpin.vercel.app/conta`
4. (Recomendado) **Authentication → Emails:** traduza o e-mail “Magic Link” para português.
   O envio padrão do Supabase tem limite baixo de e-mails por hora; para muitos usuários, configure um SMTP próprio
   (ex.: Resend, Brevo) em **Authentication → SMTP Settings**.
