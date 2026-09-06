import { useState, useEffect } from "react";
import { Product, ProductionRun } from "../types";

interface NewRunProps {
  products: Product[];
  onSave: (run: ProductionRun) => void;
}

function generateId() {
  return Math.random().toString(36).slice(2, 10).toUpperCase();
}

function formatBatchId(productName: string) {
  const prefix = productName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 4);
  const now = new Date();
  const date = now.toISOString().slice(0, 10).replace(/-/g, "");
  const rand = Math.floor(Math.random() * 1000).toString().padStart(3, "0");
  return `${prefix}-${date}-${rand}`;
}

type Step = "select" | "details";

export default function NewRun({ products, onSave }: NewRunProps) {
  const [step, setStep] = useState<Step>("select");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [batchId, setBatchId] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [timesMade, setTimesMade] = useState<string>("");
  const [totalQty, setTotalQty] = useState<string>("");
  const [boxes, setBoxes] = useState<string>("");
  const [ph, setPh] = useState<string>("");
  const [notes, setNotes] = useState("");
  const [lotCodes, setLotCodes] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);

  function resetForm() {
    setStep("select");
    setSelectedProduct(null);
    setBatchId("");
    setDateTime("");
    setTimesMade("");
    setTotalQty("");
    setBoxes("");
    setPh("");
    setNotes("");
    setLotCodes({});
    setSaved(false);
  }

  function selectProduct(p: Product) {
    setSelectedProduct(p);
    const now = new Date();
    const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16);
    setDateTime(local);
    setBatchId(formatBatchId(p.name));
    const codes: Record<string, string> = {};
    p.ingredients.forEach((i) => (codes[i.id] = ""));
    setLotCodes(codes);
    setStep("details");
  }

  function handleSubmit() {
    if (!selectedProduct || !batchId.trim() || !dateTime) return;
    const run: ProductionRun = {
      id: generateId(),
      batchId: batchId.trim(),
      productId: selectedProduct.id,
      productName: selectedProduct.name,
      dateTime,
      timesMade: parseInt(timesMade) || 0,
      totalQuantity: parseFloat(totalQty) || 0,
      boxesProduced: parseInt(boxes) || 0,
      ph: ph.trim(),
      notes: notes.trim(),
      ingredients: selectedProduct.ingredients.map((ing) => ({
        ingredientId: ing.id,
        ingredientName: ing.name,
        lotCode: lotCodes[ing.id] || "",
      })),
    };
    onSave(run);
    setSaved(true);
    setTimeout(() => resetForm(), 2000);
  }

  const canSubmit =
    selectedProduct &&
    batchId.trim() &&
    dateTime &&
    totalQty &&
    boxes;

  if (products.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <div className="text-4xl mb-3">🏭</div>
        <p className="font-medium mb-1">No product templates</p>
        <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
          Create a product in the Products tab before starting a run.
        </p>
      </div>
    );
  }

  if (saved) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center text-2xl mb-4"
          style={{ background: "#dcfce7" }}
        >
          ✓
        </div>
        <p className="font-semibold text-lg mb-1">Production run saved</p>
        <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
          Starting a new form…
        </p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Step header */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
            style={{
              background: step === "select" ? "var(--accent)" : "var(--muted)",
              color: step === "select" ? "var(--accent-foreground)" : "var(--muted-foreground)",
            }}
          >
            1
          </div>
          <span className="text-sm font-medium">Select Product</span>
        </div>
        <div className="w-6 h-px" style={{ background: "var(--border)" }} />
        <div className="flex items-center gap-2">
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
            style={{
              background: step === "details" ? "var(--accent)" : "var(--muted)",
              color: step === "details" ? "var(--accent-foreground)" : "var(--muted-foreground)",
            }}
          >
            2
          </div>
          <span className="text-sm font-medium">Enter Details</span>
        </div>
      </div>

      {step === "select" ? (
        <div className="flex-1 overflow-y-auto">
          <p className="text-sm mb-4" style={{ color: "var(--muted-foreground)" }}>
            Choose a product template to base this production run on.
          </p>
          <div className="flex flex-col gap-2">
            {products.map((p) => (
              <button
                key={p.id}
                onClick={() => selectProduct(p)}
                className="flex items-center justify-between px-4 py-3 border text-left transition-all hover:border-accent"
                style={{
                  background: "var(--card)",
                  borderColor: "var(--border)",
                  borderRadius: "var(--radius)",
                }}
              >
                <div>
                  <div className="font-medium text-sm">{p.name}</div>
                  {p.description && (
                    <div className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>
                      {p.description}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-3 ml-4 shrink-0">
                  <span className="text-xs font-mono" style={{ color: "var(--muted-foreground)" }}>
                    {p.ingredients.length} ingredient{p.ingredients.length !== 1 ? "s" : ""}
                  </span>
                  <span style={{ color: "var(--muted-foreground)" }}>→</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto flex flex-col gap-5 pb-2">
          {/* Product badge + back */}
          <div className="flex items-center justify-between">
            <div
              className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium"
              style={{
                background: "var(--secondary)",
                borderRadius: "var(--radius)",
              }}
            >
              <span>📦</span>
              <span>{selectedProduct?.name}</span>
            </div>
            <button
              onClick={() => setStep("select")}
              className="text-xs transition-colors hover:underline"
              style={{ color: "var(--muted-foreground)" }}
            >
              ← Change product
            </button>
          </div>

          <div
            className="grid gap-4"
            style={{ gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}
          >
            {/* Batch ID */}
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--muted-foreground)" }}>
                BATCH ID
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 text-sm border outline-none font-mono transition-colors"
                style={{
                  borderColor: "var(--border)",
                  borderRadius: "var(--radius)",
                  background: "var(--background)",
                }}
                value={batchId}
                onChange={(e) => setBatchId(e.target.value)}
                onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
                onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
              />
            </div>

            {/* Date/Time */}
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--muted-foreground)" }}>
                DATE & TIME
              </label>
              <input
                type="datetime-local"
                className="w-full px-3 py-2 text-sm border outline-none transition-colors"
                style={{
                  borderColor: "var(--border)",
                  borderRadius: "var(--radius)",
                  background: "var(--background)",
                }}
                value={dateTime}
                onChange={(e) => setDateTime(e.target.value)}
                onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
                onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
              />
            </div>

            {/* Total quantity */}
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--muted-foreground)" }}>
                TOTAL QUANTITY (kg / units)
              </label>
              <input
                type="number"
                min="0"
                step="0.1"
                className="w-full px-3 py-2 text-sm border outline-none transition-colors"
                style={{
                  borderColor: "var(--border)",
                  borderRadius: "var(--radius)",
                  background: "var(--background)",
                }}
                placeholder="0"
                value={totalQty}
                onChange={(e) => setTotalQty(e.target.value)}
                onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
                onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
              />
            </div>

            {/* Boxes + Times Made side by side */}
            <div className="flex gap-3">
              <div className="flex-1 min-w-0">
                <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--muted-foreground)" }}>
                  BOXES PRODUCED
                </label>
                <input
                  type="number"
                  min="0"
                  className="w-full px-3 py-2 text-sm border outline-none transition-colors"
                  style={{
                    borderColor: "var(--border)",
                    borderRadius: "var(--radius)",
                    background: "var(--background)",
                  }}
                  placeholder="0"
                  value={boxes}
                  onChange={(e) => setBoxes(e.target.value)}
                  onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
                  onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
                />
              </div>
              <div style={{ width: "90px" }}>
                <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--muted-foreground)" }}>
                  TIMES MADE
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 text-sm border outline-none transition-colors"
                  style={{
                    borderColor: "var(--border)",
                    borderRadius: "var(--radius)",
                    background: "var(--background)",
                  }}
                  placeholder="e.g. 2x"
                  value={timesMade}
                  onChange={(e) => setTimesMade(e.target.value)}
                  onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
                  onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
                />
              </div>
            </div>

            {/* pH */}
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--muted-foreground)" }}>
                pH LEVEL
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 text-sm border outline-none font-mono transition-colors"
                style={{
                  borderColor: "var(--border)",
                  borderRadius: "var(--radius)",
                  background: "var(--background)",
                }}
                placeholder="e.g. 4.2"
                value={ph}
                onChange={(e) => setPh(e.target.value)}
                onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
                onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
              />
            </div>
          </div>

          {/* Ingredient lot codes */}
          {selectedProduct && selectedProduct.ingredients.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <h3 className="text-xs font-medium" style={{ color: "var(--muted-foreground)" }}>
                  INGREDIENT LOT CODES
                </h3>
                <div
                  className="flex-1 h-px"
                  style={{ background: "var(--border)" }}
                />
              </div>
              <div
                className="grid gap-3"
                style={{ gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))" }}
              >
                {selectedProduct.ingredients.map((ing) => (
                  <div key={ing.id}>
                    <label
                      className="block text-xs font-medium mb-1.5 truncate"
                      style={{ color: "var(--muted-foreground)" }}
                    >
                      {ing.name.toUpperCase()}
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 text-sm border outline-none font-mono transition-colors"
                      style={{
                        borderColor: "var(--border)",
                        borderRadius: "var(--radius)",
                        background: "var(--background)",
                      }}
                      placeholder="LOT-XXXXX"
                      value={lotCodes[ing.id] ?? ""}
                      onChange={(e) =>
                        setLotCodes((prev) => ({ ...prev, [ing.id]: e.target.value }))
                      }
                      onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
                      onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--muted-foreground)" }}>
              NOTES (optional)
            </label>
            <textarea
              rows={2}
              className="w-full px-3 py-2 text-sm border outline-none transition-colors resize-none"
              style={{
                borderColor: "var(--border)",
                borderRadius: "var(--radius)",
                background: "var(--background)",
              }}
              placeholder="Any notes about this run…"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
              onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="w-full py-2.5 text-sm font-semibold transition-colors disabled:opacity-40 mt-1"
            style={{
              background: "var(--accent)",
              color: "var(--accent-foreground)",
              borderRadius: "var(--radius)",
            }}
          >
            Record Production Run
          </button>
        </div>
      )}
    </div>
  );
}
