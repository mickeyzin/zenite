import { AI_NOTICE } from "@/lib/ai-label";

/** Selo sobre imagens geradas por IA. O contêiner precisa de position: relative (classe .has-ai). */
export function AiBadge({ show, label = "IA" }: { show?: boolean; label?: string }) {
  if (!show) return null;
  return (
    <span className="ai-badge" title={AI_NOTICE}>
      {label}
      <span className="sr-only"> — {AI_NOTICE}</span>
    </span>
  );
}
