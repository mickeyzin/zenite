/**
 * Retorno do login no Mercado Livre. Não troca o código aqui: devolve ao painel, que confere o
 * "state" guardado no navegador e pede a troca com a sessão do administrador.
 */
export function GET(request: Request) {
  const q = new URL(request.url).searchParams;
  const back = new URL("/admin", request.url);
  const code = q.get("code");
  const state = q.get("state");
  if (code && state) {
    back.searchParams.set("ml_code", code.slice(0, 500));
    back.searchParams.set("ml_state", state.slice(0, 200));
  } else back.searchParams.set("ml_error", (q.get("error_description") ?? q.get("error") ?? "login cancelado").slice(0, 200));
  return Response.redirect(back, 302);
}
