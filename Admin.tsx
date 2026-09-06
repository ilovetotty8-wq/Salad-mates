import { useState } from "react";
import { Recipe } from "../recipe-types";

interface AdminProps {
  recipes: Recipe[];
  onSave: (recipe: Recipe) => void;
  onDelete: (id: string) => void;
  onBack: () => void;
}

const CATEGORIES = ["Cooking", "Baking", "Desserts", "Mains", "Starters", "Breakfast", "Salads", "Soups", "Pizza", "Other"];
const DIFFICULTIES = ["Easy", "Medium", "Hard"] as const;

function genId() { return Math.random().toString(36).slice(2, 10).toUpperCase(); }

const BLANK = {
  title: "", description: "", category: "Cooking", prepTime: "", cookTime: "",
  servings: "", difficulty: "Medium" as const, imageUrl: "",
  ingredients: [""], steps: [""],
};

export default function Admin({ recipes, onSave, onDelete, onBack }: AdminProps) {
  const [view, setView] = useState<"list" | "form">("list");
  const [editing, setEditing] = useState<Recipe | null>(null);
  const [form, setForm] = useState(BLANK);
  const [confirmDel, setConfirmDel] = useState<string | null>(null);

  function startNew() {
    setForm(BLANK);
    setEditing(null);
    setView("form");
  }

  function startEdit(r: Recipe) {
    setForm({
      title: r.title, description: r.description, category: r.category,
      prepTime: r.prepTime, cookTime: r.cookTime, servings: r.servings,
      difficulty: r.difficulty, imageUrl: r.imageUrl,
      ingredients: [...r.ingredients],
      steps: [...r.steps],
    });
    setEditing(r);
    setView("form");
  }

  function handleSave() {
    if (!form.title.trim()) return;
    const recipe: Recipe = {
      id: editing?.id ?? genId(),
      title: form.title.trim(),
      description: form.description.trim(),
      category: form.category,
      prepTime: form.prepTime.trim() || "—",
      cookTime: form.cookTime.trim() || "—",
      servings: form.servings.trim() || "—",
      difficulty: form.difficulty,
      imageUrl: form.imageUrl.trim() || `https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=400&fit=crop&auto=format`,
      ingredients: form.ingredients.filter((i) => i.trim()),
      steps: form.steps.filter((s) => s.trim()),
      createdAt: editing?.createdAt ?? new Date().toISOString(),
    };
    onSave(recipe);
    setView("list");
  }

  function updateList<K extends "ingredients" | "steps">(key: K, idx: number, val: string) {
    setForm((f) => {
      const arr = [...f[key]];
      arr[idx] = val;
      return { ...f, [key]: arr };
    });
  }
  function addListItem(key: "ingredients" | "steps") {
    setForm((f) => ({ ...f, [key]: [...f[key], ""] }));
  }
  function removeListItem(key: "ingredients" | "steps", idx: number) {
    setForm((f) => ({ ...f, [key]: f[key].filter((_, i) => i !== idx) }));
  }

  const inputStyle = {
    background: "#1e1810", border: "1px solid #3a2e1e", borderRadius: 10,
    color: "#f0e8dc", padding: "12px 14px", fontSize: 14, outline: "none", width: "100%",
  } as React.CSSProperties;

  if (view === "form") {
    return (
      <div className="h-full flex flex-col" style={{ background: "#12100d" }}>
        <div className="px-5 pt-12 pb-4 flex items-center gap-3 shrink-0">
          <button onClick={() => setView("list")} style={{ color: "#b89a78" }} className="text-sm">← Back</button>
          <h2 className="text-lg font-bold flex-1" style={{ fontFamily: "Lora, serif", color: "#f0e8dc" }}>
            {editing ? "Edit Recipe" : "New Recipe"}
          </h2>
          <button
            onClick={handleSave}
            disabled={!form.title.trim()}
            className="px-4 py-2 rounded-full text-xs font-semibold disabled:opacity-40"
            style={{ background: "#c8922a", color: "#12100d" }}
          >
            Save
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 pb-10 flex flex-col gap-4">
          {/* Title */}
          <div>
            <p className="text-xs tracking-wide mb-1.5" style={{ color: "#b89a78" }}>RECIPE TITLE *</p>
            <input style={inputStyle} placeholder="e.g. Lemon Herb Chicken" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
          </div>

          {/* Description */}
          <div>
            <p className="text-xs tracking-wide mb-1.5" style={{ color: "#b89a78" }}>DESCRIPTION</p>
            <textarea
              rows={2}
              style={{ ...inputStyle, resize: "none" }}
              placeholder="A short intro to the dish…"
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            />
          </div>

          {/* Image URL */}
          <div>
            <p className="text-xs tracking-wide mb-1.5" style={{ color: "#b89a78" }}>IMAGE URL</p>
            <input style={inputStyle} placeholder="https://images.unsplash.com/…" value={form.imageUrl} onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))} />
            {form.imageUrl ? (
              <img src={form.imageUrl} alt="" className="mt-2 w-full object-cover rounded-xl" style={{ height: 120 }} />
            ) : null}
          </div>

          {/* Category + Difficulty */}
          <div className="flex gap-3">
            <div className="flex-1">
              <p className="text-xs tracking-wide mb-1.5" style={{ color: "#b89a78" }}>CATEGORY</p>
              <select
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                style={{ ...inputStyle, appearance: "none" }}
              >
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="flex-1">
              <p className="text-xs tracking-wide mb-1.5" style={{ color: "#b89a78" }}>DIFFICULTY</p>
              <select
                value={form.difficulty}
                onChange={(e) => setForm((f) => ({ ...f, difficulty: e.target.value as any }))}
                style={{ ...inputStyle, appearance: "none" }}
              >
                {DIFFICULTIES.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>

          {/* Times */}
          <div className="flex gap-3">
            {[
              { label: "PREP TIME", key: "prepTime" as const, ph: "e.g. 15 min" },
              { label: "COOK TIME", key: "cookTime" as const, ph: "e.g. 30 min" },
              { label: "SERVINGS", key: "servings" as const, ph: "e.g. 4" },
            ].map((f2) => (
              <div key={f2.key} className="flex-1">
                <p className="text-xs tracking-wide mb-1.5" style={{ color: "#b89a78" }}>{f2.label}</p>
                <input style={inputStyle} placeholder={f2.ph} value={form[f2.key]} onChange={(e) => setForm((f) => ({ ...f, [f2.key]: e.target.value }))} />
              </div>
            ))}
          </div>

          {/* Ingredients */}
          <div>
            <p className="text-xs tracking-wide mb-2" style={{ color: "#b89a78" }}>INGREDIENTS</p>
            {form.ingredients.map((ing, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <input
                  style={{ ...inputStyle, flex: 1 }}
                  placeholder={`Ingredient ${i + 1}`}
                  value={ing}
                  onChange={(e) => updateList("ingredients", i, e.target.value)}
                />
                {form.ingredients.length > 1 && (
                  <button onClick={() => removeListItem("ingredients", i)} className="px-2 text-sm" style={{ color: "#6a5a4a" }}>✕</button>
                )}
              </div>
            ))}
            <button onClick={() => addListItem("ingredients")} className="text-xs mt-1" style={{ color: "#c8922a" }}>+ Add ingredient</button>
          </div>

          {/* Steps */}
          <div>
            <p className="text-xs tracking-wide mb-2" style={{ color: "#b89a78" }}>METHOD STEPS</p>
            {form.steps.map((step, i) => (
              <div key={i} className="flex gap-2 mb-2 items-start">
                <span className="text-xs font-bold mt-3 shrink-0 w-5 text-center" style={{ color: "#c8922a" }}>{i + 1}</span>
                <textarea
                  rows={2}
                  style={{ ...inputStyle, flex: 1, resize: "none" }}
                  placeholder={`Step ${i + 1}…`}
                  value={step}
                  onChange={(e) => updateList("steps", i, e.target.value)}
                />
                {form.steps.length > 1 && (
                  <button onClick={() => removeListItem("steps", i)} className="px-2 text-sm mt-2" style={{ color: "#6a5a4a" }}>✕</button>
                )}
              </div>
            ))}
            <button onClick={() => addListItem("steps")} className="text-xs mt-1" style={{ color: "#c8922a" }}>+ Add step</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col" style={{ background: "#12100d" }}>
      <div className="px-5 pt-12 pb-4 flex items-center justify-between shrink-0">
        <div>
          <button onClick={onBack} className="text-xs mb-2 flex items-center gap-1" style={{ color: "#b89a78" }}>← Home</button>
          <h2 className="text-2xl font-bold" style={{ fontFamily: "Lora, serif", color: "#f0e8dc" }}>Chef Admin</h2>
          <p className="text-xs mt-0.5" style={{ color: "#b89a78" }}>{recipes.length} recipes published</p>
        </div>
        <button
          onClick={startNew}
          className="px-4 py-2 rounded-full text-xs font-semibold"
          style={{ background: "#c8922a", color: "#12100d" }}
        >
          + New Recipe
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-10 flex flex-col gap-3">
        {recipes.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <p className="text-4xl mb-3">📝</p>
            <p className="font-medium mb-1" style={{ color: "#f0e8dc" }}>No recipes yet</p>
            <p className="text-sm" style={{ color: "#b89a78" }}>Tap "New Recipe" to add your first dish.</p>
          </div>
        ) : (
          recipes.map((r) => (
            <div
              key={r.id}
              className="flex items-center gap-3 rounded-2xl overflow-hidden"
              style={{ background: "#1e1810", border: "1px solid #3a2e1e" }}
            >
              <img src={r.imageUrl} alt={r.title} className="w-16 h-16 object-cover shrink-0" />
              <div className="flex-1 min-w-0 py-3">
                <p className="text-sm font-semibold truncate" style={{ fontFamily: "Lora, serif", color: "#f0e8dc" }}>{r.title}</p>
                <p className="text-xs mt-0.5" style={{ color: "#b89a78" }}>{r.category} · {r.difficulty}</p>
              </div>
              <div className="flex gap-1 pr-3">
                <button
                  onClick={() => startEdit(r)}
                  className="px-3 py-1.5 rounded-full text-xs font-medium"
                  style={{ background: "#2a2018", color: "#c8922a" }}
                >
                  Edit
                </button>
                {confirmDel === r.id ? (
                  <button
                    onClick={() => { onDelete(r.id); setConfirmDel(null); }}
                    className="px-3 py-1.5 rounded-full text-xs font-medium"
                    style={{ background: "#e0706022", color: "#e07060" }}
                  >
                    Confirm
                  </button>
                ) : (
                  <button
                    onClick={() => setConfirmDel(r.id)}
                    className="px-3 py-1.5 rounded-full text-xs font-medium"
                    style={{ background: "#2a2018", color: "#6a5a4a" }}
                  >
                    Del
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
