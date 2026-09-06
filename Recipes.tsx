import { useState } from "react";
import { Recipe } from "../recipe-types";

interface RecipesProps {
  recipes: Recipe[];
  onSelect: (recipe: Recipe) => void;
}

const CATEGORIES = ["All", "Cooking", "Baking", "Desserts", "Mains", "Starters", "Breakfast", "Salads", "Soups", "Pizza", "Other"];

export default function Recipes({ recipes, onSelect }: RecipesProps) {
  const [cat, setCat] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = recipes.filter((r) => {
    const matchCat = cat === "All" || r.category === cat;
    const matchSearch = !search || r.title.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="h-full flex flex-col" style={{ background: "#12100d" }}>
      {/* Header */}
      <div className="px-5 pt-12 pb-4 shrink-0">
        <p className="text-xs tracking-widest uppercase mb-1" style={{ color: "#c8922a" }}>Your Library</p>
        <h2 className="text-2xl font-bold" style={{ fontFamily: "Lora, serif", color: "#f0e8dc" }}>
          Recipes
        </h2>
      </div>

      {/* Search */}
      <div className="px-5 mb-3 shrink-0">
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm" style={{ color: "#6a5a4a" }}>⌕</span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search recipes…"
            style={{
              background: "#1e1810", border: "1px solid #3a2e1e", borderRadius: 12,
              color: "#f0e8dc", padding: "12px 16px 12px 36px", fontSize: 14,
              outline: "none", width: "100%",
            }}
          />
        </div>
      </div>

      {/* Category pills */}
      <div className="shrink-0 px-5 mb-4">
        <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
          {CATEGORIES.filter((c) => c === "All" || recipes.some((r) => r.category === c)).map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className="shrink-0 px-4 py-1.5 rounded-full text-xs font-medium transition-colors"
              style={{
                background: cat === c ? "#c8922a" : "#1e1810",
                color: cat === c ? "#12100d" : "#b89a78",
                border: `1px solid ${cat === c ? "#c8922a" : "#3a2e1e"}`,
              }}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto px-5 pb-24">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <p className="text-4xl mb-3">🍽️</p>
            <p className="font-medium" style={{ color: "#f0e8dc" }}>
              {recipes.length === 0 ? "No recipes yet" : "No recipes match"}
            </p>
            <p className="text-sm mt-1" style={{ color: "#b89a78" }}>
              {recipes.length === 0 ? "The chef hasn't uploaded any recipes yet." : "Try a different search or category."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filtered.map((r) => (
              <button
                key={r.id}
                onClick={() => onSelect(r)}
                className="text-left rounded-2xl overflow-hidden active:scale-95 transition-transform"
                style={{ background: "#1e1810", border: "1px solid #3a2e1e" }}
              >
                <div className="relative" style={{ height: 120 }}>
                  <img src={r.imageUrl} alt={r.title} className="w-full h-full object-cover" />
                  <div
                    className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-xs font-medium"
                    style={{
                      background: "rgba(18,16,13,0.7)",
                      color: diffColor(r.difficulty),
                    }}
                  >
                    {r.difficulty}
                  </div>
                </div>
                <div className="p-3">
                  <p className="text-sm font-semibold leading-tight mb-1" style={{ fontFamily: "Lora, serif", color: "#f0e8dc" }}>
                    {r.title}
                  </p>
                  <p className="text-xs" style={{ color: "#b89a78" }}>{r.category} · {r.cookTime}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function diffColor(d: string) {
  if (d === "Easy") return "#7ec87e";
  if (d === "Medium") return "#c8922a";
  return "#e07060";
}
