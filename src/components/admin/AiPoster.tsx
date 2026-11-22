"use client";

import type { SupabaseClient } from "@supabase/supabase-js";
import { useState } from "react";
import { cropToWebp } from "@/lib/image-resize";
import { AI_CREDIT, AI_LICENSE } from "@/lib/ai-label";

/* ——— Chamadas à rota /api/ilustracao (só administradores) ——— */
async function call(sb: SupabaseClient, body: Record<string, unknown>) {
  const { data } = await sb.auth.getSession();
  const token = data.session?.access_token;
  if (!token) throw new Error("Sessão expirada: entre de novo.");
  const res = await fetch("/api/ilustracao", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.error ?? `Erro ${res.status}`);
  return json;
}

export const describe = (sb: SupabaseClient, perfumeId: string, reference?: string | null) =>
  call(sb, { action: "describe", perfumeId, reference: reference ?? null }) as Promise<{
    description: string | null;
    reference: string | null;
    source?: string | null;
    note?: string;
  }>;
export const generate = (sb: SupabaseClient, perfumeId: string, description: string | null) =>
  call(sb, { action: "generate", perfumeId, description }) as Promise<{ image: string }>;

/** Salva a imagem gerada como pôster (marcado como IA). Só substitui pôster que também seja de IA. */
export async function saveAiPoster(sb: SupabaseClient, perfume: { id: string; slug: string }, dataUrl: string) {
  const blob = await (await fetch(dataUrl)).blob();
  const webp = await cropToWebp(new File([blob], "ia.png", { type: "image/png" }), 900, 1100);
  const path = `${perfume.slug}/ia-${Date.now()}.webp`;
  const up = await sb.storage.from("perfumes").upload(path, webp, { contentType: "image/webp", upsert: false });
  if (up.error) throw new Error(`Envio: ${up.error.message}`);
  const url = sb.storage.from("perfumes").getPublicUrl(path).data.publicUrl;
  const { data: current } = await sb.from("perfume_images").select("id, license").eq("perfume_id", perfume.id).eq("kind", "poster");
  if ((current ?? []).some((i) => i.license !== AI_LICENSE)) throw new Error("O perfume já tem foto real: a ilustração não a substitui.");
  await sb.from("perfume_images").delete().eq("perfume_id", perfume.id).eq("kind", "poster");
  const ins = await sb.from("perfume_images").insert({ perfume_id: perfume.id, url, kind: "poster", credit: AI_CREDIT, license: AI_LICENSE });
  if (ins.error) throw new Error(ins.error.message);
  return url;
}

/** Foto de referência escolhida no computador → data URL pequena (só para a IA ler; não é guardada). */
export async function fileToDataUrl(file: File) {
  const img = await createImageBitmap(file);
  const scale = Math.min(1, 1024 / Math.max(img.width, img.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(img.width * scale);
  canvas.height = Math.round(img.height * scale);
  canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
  img.close();
  return canvas.toDataURL("image/jpeg", 0.88);
}

/** Painel de um perfume: referência → descrição (editável) → imagem → aprovar. */
export function AiPoster({
  sb,
  perfume,
  hasRealPoster,
  onSaved,
}: {
  sb: SupabaseClient;
  perfume: { id: string; slug: string };
  hasRealPoster: boolean;
  onSaved: () => Promise<void>;
}) {
  const [reference, setReference] = useState<string | null>(null); // data URL enviada
  const [refShown, setRefShown] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [busy, setBusy] = useState<null | "describe" | "generate" | "save">(null);
  const [msg, setMsg] = useState<string | null>(null);

  const run = async (step: "describe" | "generate" | "save") => {
    setBusy(step);
    setMsg(null);
    try {
      if (step === "describe") {
        const r = await describe(sb, perfume.id, reference);
        setRefShown(r.reference ?? reference);
        if (r.description) setDescription(r.description);
        else setMsg(r.note ?? "Sem referência.");
      } else if (step === "generate") {
        const r = await generate(sb, perfume.id, description.trim() || null);
        setImage(r.image);
      } else if (image) {
        await saveAiPoster(sb, perfume, image);
        setMsg("Ilustração salva como pôster.");
        setImage(null);
        await onSaved();
      }
    } catch (e) {
      setMsg(`Erro: ${(e as Error).message}`);
    }
    setBusy(null);
  };

  return (
    <fieldset className="admin-fieldset admin-ai">
      <legend>Ilustração com IA</legend>
      <p className="admin-muted">
        A IA olha uma foto de referência do frasco (a do site oficial, achada sozinha, ou uma que você enviar), escreve a descrição e
        gera uma imagem realista. No site ela aparece com o selo “Ilustração IA” e o aviso de que pode ter diferenças. A referência
        não é guardada nem publicada. Cada geração custa alguns centavos na conta da OpenAI.
      </p>
      {hasRealPoster && <p className="admin-error">Este perfume já tem foto real; a ilustração não vai substituí-la.</p>}
      <div className="admin-ai-grid">
        <div className="admin-grid">
          <label className="admin-field">
            Foto de referência (opcional: sem ela, usa a do site oficial)
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={async (e) => {
                const f = e.target.files?.[0];
                if (!f) return;
                const d = await fileToDataUrl(f);
                setReference(d);
                setRefShown(d);
              }}
            />
          </label>
          <div className="admin-actions">
            <button className="btn-ghost" disabled={!!busy} onClick={() => run("describe")}>
              {busy === "describe" ? "Descrevendo…" : "1. Descrever o frasco"}
            </button>
          </div>
          <label className="admin-field">
            Descrição do frasco (pode corrigir; vazia = a IA gera de memória, menos fiel)
            <textarea className="admin-textarea" rows={6} value={description} onChange={(e) => setDescription(e.target.value)} />
          </label>
          <div className="admin-actions">
            <button className="btn-ghost" disabled={!!busy} onClick={() => run("generate")}>
              {busy === "generate" ? "Gerando… (cerca de 1 min)" : "2. Gerar imagem"}
            </button>
            <button className="btn-primary" disabled={!!busy || !image || hasRealPoster} onClick={() => run("save")}>
              {busy === "save" ? "Salvando…" : "3. Usar como pôster"}
            </button>
          </div>
        </div>
        <div className="admin-ai-previews">
          {refShown && (
            <figure>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={refShown} alt="Referência" />
              <figcaption className="admin-muted">Referência (não é publicada)</figcaption>
            </figure>
          )}
          {image && (
            <figure>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={image} alt="Imagem gerada" />
              <figcaption className="admin-muted">Gerada — confira antes de usar</figcaption>
            </figure>
          )}
        </div>
      </div>
      {msg && <p className={msg.startsWith("Erro") ? "admin-error" : "admin-notice"}>{msg}</p>}
    </fieldset>
  );
}
