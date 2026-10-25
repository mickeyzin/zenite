"use client";

import Link from "next/link";
import { Icon } from "@/components/ui/Icons";
import { useSession } from "@/lib/supabase/useSession";

/** Link do menu: "Entrar" ou "Minha conta" (só ícone no celular). */
export function AccountLink() {
  const { sb, session } = useSession();
  if (!sb) return null; // banco não configurado: sem contas
  const label = session ? "Minha conta" : "Entrar";
  return (
    <Link href="/conta" className="nav-link nav-account" aria-label={label}>
      <Icon name="user" size={18} className={session ? "is-on" : ""} />
      <span className="hidden md:inline">{label}</span>
    </Link>
  );
}
