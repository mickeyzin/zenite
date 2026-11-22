import { supabaseEnabled } from "@/lib/supabase/config";
import { anonClient } from "@/lib/supabase/server";

/**
 * "Despertador" do banco: a Vercel chama esta rota uma vez por dia (vercel.json → crons) e ela faz uma
 * consulta leve ao Supabase, para o projeto gratuito não ser pausado por falta de uso.
 * Se CRON_SECRET estiver configurada na Vercel, só aceita a chamada da própria Vercel.
 */
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret && request.headers.get("authorization") !== `Bearer ${secret}`) return Response.json({ ok: false }, { status: 401 });
  if (!supabaseEnabled) return Response.json({ ok: false, error: "Supabase não configurado" }, { status: 503 });
  const { error } = await anonClient().from("brands").select("slug").limit(1);
  return Response.json({ ok: !error, at: new Date().toISOString(), ...(error ? { error: error.message } : {}) }, { status: error ? 502 : 200 });
}
