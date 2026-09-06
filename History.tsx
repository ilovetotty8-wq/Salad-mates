import { useState, useMemo } from "react";
import { ProductionRun } from "../types";

interface HistoryProps {
  runs: ProductionRun[];
  onDelete: (id: string) => void;
}

function formatDate(iso: string) {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function History({ runs, onDelete }: HistoryProps) {
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return [...runs].reverse();
    return [...runs]
      .filter((r) => {
        const dateStr = formatDate(r.dateTime).toLowerCase();
        return (
          r.productName.toLowerCase().includes(q) ||
          r.batchId.toLowerCase().includes(q) ||
          dateStr.includes(q) ||
          r.ingredients.some(
            (i) =>
              i.lotCode.toLowerCase().includes(q) ||
              i.ingredientName.toLowerCase().includes(q)
          ) ||
          r.notes.toLowerCase().includes(q)
        );
      })
      .reverse();
  }, [runs, query]);

  if (runs.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <div className="text-4xl mb-3">📋</div>
        <p className="font-medium mb-1">No production runs yet</p>
        <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
          Completed runs will appear here with full traceability data.
        </p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Search */}
      <div className="mb-5">
        <div className="relative">
          <span
            className="absolute left-3 top-1/2 -translate-y-1/2 text-sm"
            style={{ color: "var(--muted-foreground)" }}
          >
            ⌕
          </span>
          <input
            type="text"
            className="w-full pl-8 pr-4 py-2 text-sm border outline-none transition-colors"
            style={{
              borderColor: "var(--border)",
              borderRadius: "var(--radius)",
              background: "var(--card)",
            }}
            placeholder="Search by product, date, batch ID, or lot code…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
            onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
          />
        </div>
        <p className="text-xs mt-2" style={{ color: "var(--muted-foreground)" }}>
          {filtered.length} of {runs.length} run{runs.length !== 1 ? "s" : ""}
          {query && ` matching "${query}"`}
        </p>
      </div>

      {/* Run list */}
      <div className="flex-1 overflow-y-auto flex flex-col gap-2">
        {filtered.length === 0 ? (
          <div className="text-center py-10" style={{ color: "var(--muted-foreground)" }}>
            <p className="text-sm">No runs match your search.</p>
          </div>
        ) : (
          filtered.map((run) => {
            const isExpanded = expanded === run.id;
            return (
              <div
                key={run.id}
                className="border overflow-hidden"
                style={{
                  background: "var(--card)",
                  borderColor: isExpanded ? "var(--accent)" : "var(--border)",
                  borderRadius: "var(--radius)",
                }}
              >
                {/* Row header */}
                <button
                  className="w-full px-4 py-3 flex items-center gap-4 text-left transition-colors hover:bg-secondary"
                  onClick={() => setExpanded(isExpanded ? null : run.id)}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="font-medium text-sm">{run.productName}</span>
                      <span
                        className="font-mono text-xs px-2 py-0.5"
                        style={{
                          background: "var(--secondary)",
                          borderRadius: "var(--radius)",
                          color: "var(--foreground)",
                        }}
                      >
                        {run.batchId}
                      </span>
                    </div>
                    <div className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>
                      {formatDate(run.dateTime)}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 shrink-0">
                    <div className="text-right hidden sm:block">
                      <div className="text-xs font-medium">{run.totalQuantity} units</div>
                      <div className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                        {run.boxesProduced} boxes
                      </div>
                    </div>
                    <span
                      className="text-xs transition-transform"
                      style={{
                        color: "var(--muted-foreground)",
                        transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                        display: "inline-block",
                      }}
                    >
                      ▾
                    </span>
                  </div>
                </button>

                {/* Expanded detail */}
                {isExpanded && (
                  <div
                    className="px-4 pb-4 border-t"
                    style={{ borderColor: "var(--border)" }}
                  >
                    <div
                      className="grid gap-4 pt-4"
                      style={{ gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))" }}
                    >
                      <Stat label="Times Made" value={String(run.timesMade) || "—"} />
                      <Stat label="Total Quantity" value={String(run.totalQuantity)} />
                      <Stat label="Boxes" value={String(run.boxesProduced)} />
                      {run.ph && <Stat label="pH Level" value={run.ph} mono />}
                      <Stat label="Recorded" value={formatDate(run.dateTime)} small />
                    </div>

                    {run.ingredients.length > 0 && (
                      <div className="mt-4">
                        <p className="text-xs font-medium mb-2" style={{ color: "var(--muted-foreground)" }}>
                          INGREDIENT LOT CODES
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {run.ingredients.map((ing) => (
                            <div
                              key={ing.ingredientId}
                              className="flex flex-col px-3 py-2"
                              style={{
                                background: "var(--secondary)",
                                borderRadius: "var(--radius)",
                                minWidth: "120px",
                              }}
                            >
                              <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                                {ing.ingredientName}
                              </span>
                              <span className="font-mono text-sm font-medium mt-0.5">
                                {ing.lotCode || <span style={{ color: "var(--muted-foreground)" }}>—</span>}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {run.notes && (
                      <div className="mt-4">
                        <p className="text-xs font-medium mb-1" style={{ color: "var(--muted-foreground)" }}>
                          NOTES
                        </p>
                        <p className="text-sm">{run.notes}</p>
                      </div>
                    )}

                    <div className="mt-4 flex justify-end">
                      {confirmDelete === run.id ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() => { onDelete(run.id); setConfirmDelete(null); setExpanded(null); }}
                            className="px-3 py-1.5 text-xs font-medium text-white"
                            style={{ background: "#dc2626", borderRadius: "var(--radius)" }}
                          >
                            Confirm Delete
                          </button>
                          <button
                            onClick={() => setConfirmDelete(null)}
                            className="px-3 py-1.5 text-xs font-medium border"
                            style={{ borderColor: "var(--border)", borderRadius: "var(--radius)" }}
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setConfirmDelete(run.id)}
                          className="px-3 py-1.5 text-xs font-medium border transition-colors hover:border-red-300 hover:text-red-600"
                          style={{ borderColor: "var(--border)", borderRadius: "var(--radius)" }}
                        >
                          Delete Run
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

function Stat({ label, value, small, mono }: { label: string; value: string; small?: boolean; mono?: boolean }) {
  return (
    <div>
      <p className="text-xs font-medium mb-0.5" style={{ color: "var(--muted-foreground)" }}>
        {label.toUpperCase()}
      </p>
      <p className={`${small ? "text-xs font-medium" : "text-sm font-semibold"} ${mono ? "font-mono" : ""}`}>{value}</p>
    </div>
  );
}
