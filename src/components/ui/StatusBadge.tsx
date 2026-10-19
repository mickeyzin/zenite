import type { DataStatus } from "@/data/types";

const LABEL: Record<DataStatus, string> = {
  verificado: "Verificado",
  "a-confirmar": "A confirmar",
  provisorio: "Provisório",
};

export function StatusBadge({ status, note }: { status: DataStatus; note?: string }) {
  return (
    <span className={`status-badge status-${status}`} title={note}>
      <span aria-hidden className="status-dot" />
      {LABEL[status]}
      {note ? <span className="sr-only">: {note}</span> : null}
    </span>
  );
}
