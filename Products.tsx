import { useState } from "react";
import { Product, Ingredient } from "../types";

interface ProductsProps {
  products: Product[];
  onSave: (product: Product) => void;
  onDelete: (id: string) => void;
}

function generateId() {
  return Math.random().toString(36).slice(2, 10).toUpperCase();
}

const BLANK_PRODUCT: Omit<Product, "id" | "createdAt"> = {
  name: "",
  description: "",
  ingredients: [],
};

export default function Products({ products, onSave, onDelete }: ProductsProps) {
  const [editing, setEditing] = useState<Product | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState(BLANK_PRODUCT);
  const [newIngredientName, setNewIngredientName] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  function startCreate() {
    setForm(BLANK_PRODUCT);
    setEditing(null);
    setCreating(true);
    setNewIngredientName("");
  }

  function startEdit(p: Product) {
    setForm({ name: p.name, description: p.description, ingredients: [...p.ingredients] });
    setEditing(p);
    setCreating(false);
    setNewIngredientName("");
  }

  function cancelForm() {
    setEditing(null);
    setCreating(false);
    setForm(BLANK_PRODUCT);
    setNewIngredientName("");
  }

  function addIngredient() {
    const trimmed = newIngredientName.trim();
    if (!trimmed) return;
    setForm((f) => ({
      ...f,
      ingredients: [...f.ingredients, { id: generateId(), name: trimmed }],
    }));
    setNewIngredientName("");
  }

  function removeIngredient(id: string) {
    setForm((f) => ({ ...f, ingredients: f.ingredients.filter((i) => i.id !== id) }));
  }

  function handleSave() {
    if (!form.name.trim()) return;
    if (editing) {
      onSave({ ...editing, name: form.name.trim(), description: form.description.trim(), ingredients: form.ingredients });
    } else {
      onSave({
        id: generateId(),
        name: form.name.trim(),
        description: form.description.trim(),
        ingredients: form.ingredients,
        createdAt: new Date().toISOString(),
      });
    }
    cancelForm();
  }

  const showForm = creating || editing !== null;

  return (
    <div className="flex gap-6 h-full">
      {/* Product list */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">Product Templates</h2>
            <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
              {products.length} {products.length === 1 ? "product" : "products"}
            </p>
          </div>
          <button
            onClick={startCreate}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors"
            style={{
              background: "var(--primary)",
              color: "var(--primary-foreground)",
              borderRadius: "var(--radius)",
            }}
          >
            <span className="text-base leading-none">+</span> New Product
          </button>
        </div>

        {products.length === 0 && !showForm ? (
          <div
            className="flex-1 flex flex-col items-center justify-center text-center border border-dashed"
            style={{ borderColor: "var(--border)", borderRadius: "var(--radius)" }}
          >
            <div className="text-4xl mb-3">📦</div>
            <p className="font-medium mb-1">No products yet</p>
            <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
              Create your first product template to get started
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-2 overflow-y-auto">
            {products.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between px-4 py-3 border transition-shadow"
                style={{
                  background: "var(--card)",
                  borderColor: editing?.id === p.id ? "var(--accent)" : "var(--border)",
                  borderRadius: "var(--radius)",
                }}
              >
                <div className="min-w-0">
                  <div className="font-medium text-sm truncate">{p.name}</div>
                  <div className="flex items-center gap-3 mt-0.5">
                    {p.description && (
                      <span className="text-xs truncate" style={{ color: "var(--muted-foreground)" }}>
                        {p.description}
                      </span>
                    )}
                    <span
                      className="text-xs font-mono shrink-0"
                      style={{ color: "var(--muted-foreground)" }}
                    >
                      {p.ingredients.length} ingredient{p.ingredients.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1 ml-3">
                  <button
                    onClick={() => startEdit(p)}
                    className="px-3 py-1.5 text-xs font-medium border transition-colors hover:bg-secondary"
                    style={{ borderColor: "var(--border)", borderRadius: "var(--radius)" }}
                  >
                    Edit
                  </button>
                  {confirmDelete === p.id ? (
                    <div className="flex gap-1">
                      <button
                        onClick={() => { onDelete(p.id); setConfirmDelete(null); }}
                        className="px-3 py-1.5 text-xs font-medium text-white transition-colors"
                        style={{ background: "#dc2626", borderRadius: "var(--radius)" }}
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => setConfirmDelete(null)}
                        className="px-3 py-1.5 text-xs font-medium border transition-colors"
                        style={{ borderColor: "var(--border)", borderRadius: "var(--radius)" }}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmDelete(p.id)}
                      className="px-3 py-1.5 text-xs font-medium border transition-colors hover:border-red-300 hover:text-red-600"
                      style={{ borderColor: "var(--border)", borderRadius: "var(--radius)" }}
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Form panel */}
      {showForm && (
        <div
          className="w-80 shrink-0 flex flex-col border overflow-y-auto"
          style={{
            background: "var(--card)",
            borderColor: "var(--border)",
            borderRadius: "var(--radius)",
          }}
        >
          <div className="px-5 py-4 border-b" style={{ borderColor: "var(--border)" }}>
            <h3 className="font-semibold text-sm">{editing ? "Edit Product" : "New Product"}</h3>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-4">
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--muted-foreground)" }}>
                PRODUCT NAME *
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 text-sm border outline-none transition-colors"
                style={{
                  borderColor: "var(--border)",
                  borderRadius: "var(--radius)",
                  background: "var(--background)",
                }}
                placeholder="e.g. Strawberry Jam 250g"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
                onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
              />
            </div>

            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--muted-foreground)" }}>
                DESCRIPTION
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 text-sm border outline-none transition-colors"
                style={{
                  borderColor: "var(--border)",
                  borderRadius: "var(--radius)",
                  background: "var(--background)",
                }}
                placeholder="Optional notes"
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
                onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
              />
            </div>

            <div>
              <label className="block text-xs font-medium mb-2" style={{ color: "var(--muted-foreground)" }}>
                INGREDIENTS ({form.ingredients.length})
              </label>
              <div className="flex flex-col gap-1 mb-2">
                {form.ingredients.map((ing) => (
                  <div
                    key={ing.id}
                    className="flex items-center justify-between px-3 py-1.5"
                    style={{
                      background: "var(--secondary)",
                      borderRadius: "var(--radius)",
                    }}
                  >
                    <span className="text-sm">{ing.name}</span>
                    <button
                      onClick={() => removeIngredient(ing.id)}
                      className="text-xs ml-2 transition-colors hover:text-red-600"
                      style={{ color: "var(--muted-foreground)" }}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  className="flex-1 px-3 py-2 text-sm border outline-none transition-colors"
                  style={{
                    borderColor: "var(--border)",
                    borderRadius: "var(--radius)",
                    background: "var(--background)",
                  }}
                  placeholder="Ingredient name"
                  value={newIngredientName}
                  onChange={(e) => setNewIngredientName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addIngredient()}
                  onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
                  onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
                />
                <button
                  onClick={addIngredient}
                  className="px-3 py-2 text-sm font-medium border transition-colors hover:bg-secondary"
                  style={{ borderColor: "var(--border)", borderRadius: "var(--radius)" }}
                >
                  Add
                </button>
              </div>
            </div>
          </div>

          <div className="px-5 py-4 border-t flex gap-2" style={{ borderColor: "var(--border)" }}>
            <button
              onClick={handleSave}
              disabled={!form.name.trim()}
              className="flex-1 py-2 text-sm font-medium transition-colors disabled:opacity-40"
              style={{
                background: "var(--accent)",
                color: "var(--accent-foreground)",
                borderRadius: "var(--radius)",
              }}
            >
              {editing ? "Save Changes" : "Create Product"}
            </button>
            <button
              onClick={cancelForm}
              className="px-4 py-2 text-sm font-medium border transition-colors hover:bg-secondary"
              style={{ borderColor: "var(--border)", borderRadius: "var(--radius)" }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
