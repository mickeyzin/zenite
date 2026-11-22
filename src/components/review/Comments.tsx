"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useSession } from "@/lib/supabase/useSession";

interface Row {
  id: number;
  author_name: string;
  body: string;
  created_at: string;
  user_id?: string;
}

const MAX = 1000;
const fmt = (s: string) => new Date(s).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });

/** Comentários dos leitores: opinião de quem usou, separada da avaliação editorial. */
export function Comments({ slug, name }: { slug: string; name: string }) {
  const { sb, session } = useSession();
  const uid = session?.user.id;
  const [perfumeId, setPerfumeId] = useState<string | null>(null);
  const [rows, setRows] = useState<Row[] | null>(null);
  const [off, setOff] = useState(false); // banco sem a tabela (migração ainda não aplicada) ou sem conexão
  const [admin, setAdmin] = useState(false);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!sb || session === undefined) return;
    const p = await sb.from("perfumes").select("id").eq("slug", slug).maybeSingle();
    if (!p.data) return setOff(true);
    setPerfumeId(p.data.id);
    const cols = uid ? "id, author_name, body, created_at, user_id" : "id, author_name, body, created_at";
    const c = await sb
      .from("comments")
      .select(cols)
      .eq("perfume_id", p.data.id)
      .eq("hidden", false)
      .order("created_at", { ascending: false })
      .limit(100);
    if (c.error) return setOff(true);
    setRows(c.data as unknown as Row[]);
  }, [sb, session, slug, uid]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- carrega do banco ao abrir / ao mudar a sessão
    load();
  }, [load]);
  useEffect(() => {
    if (!sb || !uid) return;
    sb.rpc("is_admin").then(({ data }) => setAdmin(data === true));
  }, [sb, uid]);

  if (off) return null;

  const send = async () => {
    if (!sb || !perfumeId) return;
    setBusy(true);
    setMsg(null);
    const { error } = await sb.from("comments").insert({ perfume_id: perfumeId, body: text.trim() });
    setBusy(false);
    if (error)
      return setMsg(error.message.includes("check") ? "O comentário precisa ter de 2 a 1000 caracteres." : error.message);
    setText("");
    load();
  };
  const remove = async (r: Row, hide: boolean) => {
    if (!sb || !confirm(hide ? "Ocultar este comentário do site?" : "Apagar o seu comentário?")) return;
    const { error } = hide
      ? await sb.from("comments").update({ hidden: true }).eq("id", r.id)
      : await sb.from("comments").delete().eq("id", r.id);
    if (error) return setMsg(error.message);
    setRows((cur) => cur?.filter((x) => x.id !== r.id) ?? null);
  };

  return (
    <section id="comentarios" className="review-section" aria-labelledby="comentarios-t">
      <h2 id="comentarios-t">Comentários dos leitores</h2>
      <div className="comments">
        <p className="review-method">
          Opinião de quem usou, separada da avaliação editorial. Comentários são públicos, com o nome do seu perfil.
        </p>

        {uid ? (
          <form
            className="comment-form"
            onSubmit={(e) => {
              e.preventDefault();
              send();
            }}
          >
            <label className="sr-only" htmlFor="comment-body">
              Seu comentário sobre {name}
            </label>
            <textarea
              id="comment-body"
              rows={3}
              maxLength={MAX}
              value={text}
              placeholder={`Como ${name} se comportou na sua pele? Fixação, projeção, ocasiões…`}
              onChange={(e) => setText(e.target.value)}
            />
            <div className="comment-form-foot">
              <span className="comment-count">
                {text.length}/{MAX}
              </span>
              <button className="btn-primary" disabled={busy || text.trim().length < 2 || !perfumeId}>
                {busy ? "Enviando…" : "Comentar"}
              </button>
            </div>
            {msg && (
              <p className="comment-msg" role="alert">
                {msg}
              </p>
            )}
          </form>
        ) : (
          session !== undefined && (
            <p className="comment-login">
              <Link href="/conta">Entre na sua conta</Link> para comentar.
            </p>
          )
        )}

        {rows === null ? (
          <p className="text-[var(--z-muted)]">Carregando comentários…</p>
        ) : rows.length === 0 ? (
          <p className="text-[var(--z-muted)]">Ainda não há comentários. Seja a primeira pessoa a contar como foi.</p>
        ) : (
          <ul className="comment-list">
            {rows.map((r) => (
              <li key={r.id} className="comment">
                <p className="comment-head">
                  <span className="comment-avatar" aria-hidden>
                    {r.author_name.trim().charAt(0).toUpperCase() || "L"}
                  </span>
                  <strong>{r.author_name}</strong>
                  <time dateTime={r.created_at}>{fmt(r.created_at)}</time>
                </p>
                <p className="comment-body">{r.body}</p>
                {(r.user_id === uid || admin) && (
                  <p className="comment-actions">
                    {r.user_id === uid && (
                      <button type="button" className="admin-link" onClick={() => remove(r, false)}>
                        Apagar
                      </button>
                    )}
                    {admin && r.user_id !== uid && (
                      <button type="button" className="admin-link" onClick={() => remove(r, true)}>
                        Ocultar
                      </button>
                    )}
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
