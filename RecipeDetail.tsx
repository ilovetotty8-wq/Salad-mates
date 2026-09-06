import { Recipe } from "../recipe-types";

interface RecipeDetailProps {
  recipe: Recipe;
  onBack: () => void;
}

export default function RecipeDetail({ recipe, onBack }: RecipeDetailProps) {
  return (
    <div className="h-full overflow-y-auto" style={{ background: "#12100d" }}>
      {/* Hero image */}
      <div className="relative" style={{ height: 280 }}>
        <img src={recipe.imageUrl} alt={recipe.title} className="w-full h-full object-cover" />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(to top, #12100d 10%, transparent 60%)" }}
        />
        <button
          onClick={onBack}
          className="absolute top-12 left-5 w-9 h-9 rounded-full flex items-center justify-center text-sm"
          style={{ background: "rgba(18,16,13,0.7)", color: "#f0e8dc" }}
        >
          ←
        </button>
        <div className="absolute bottom-0 left-0 px-5 pb-4">
          <span
            className="inline-block px-2 py-0.5 rounded-full text-xs font-medium mb-2"
            style={{ background: "#c8922a22", color: "#c8922a", border: "1px solid #c8922a44" }}
          >
            {recipe.category}
          </span>
          <h1 className="text-2xl font-bold leading-tight" style={{ fontFamily: "Lora, serif", color: "#f0e8dc" }}>
            {recipe.title}
          </h1>
        </div>
      </div>

      {/* Meta row */}
      <div className="flex items-center gap-4 px-5 py-4 border-b" style={{ borderColor: "#2a2018" }}>
        {[
          { label: "Prep", value: recipe.prepTime },
          { label: "Cook", value: recipe.cookTime },
          { label: "Serves", value: recipe.servings },
          { label: "Level", value: recipe.difficulty },
        ].map((m) => (
          <div key={m.label} className="flex-1 text-center">
            <p className="text-xs mb-0.5" style={{ color: "#b89a78" }}>{m.label}</p>
            <p className="text-sm font-semibold" style={{ color: "#f0e8dc" }}>{m.value}</p>
          </div>
        ))}
      </div>

      {/* Description */}
      {recipe.description && (
        <div className="px-5 py-4 border-b" style={{ borderColor: "#2a2018" }}>
          <p className="text-sm leading-relaxed" style={{ color: "#b89a78", fontStyle: "italic" }}>
            {recipe.description}
          </p>
        </div>
      )}

      {/* Ingredients */}
      <div className="px-5 py-5">
        <h3 className="text-base font-semibold mb-4" style={{ fontFamily: "Lora, serif", color: "#f0e8dc" }}>
          Ingredients
        </h3>
        <ul className="flex flex-col gap-3">
          {recipe.ingredients.map((ing, i) => (
            <li key={i} className="flex items-start gap-3 text-sm" style={{ color: "#d4c4b0" }}>
              <span
                className="w-5 h-5 rounded-full flex items-center justify-center text-xs shrink-0 mt-0.5"
                style={{ background: "#2a2018", color: "#c8922a" }}
              >
                {i + 1}
              </span>
              {ing}
            </li>
          ))}
        </ul>
      </div>

      {/* Steps */}
      <div className="px-5 pb-12">
        <h3 className="text-base font-semibold mb-4" style={{ fontFamily: "Lora, serif", color: "#f0e8dc" }}>
          Method
        </h3>
        <ol className="flex flex-col gap-5">
          {recipe.steps.map((step, i) => (
            <li key={i} className="flex gap-4">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5"
                style={{ background: "#c8922a", color: "#12100d" }}
              >
                {i + 1}
              </div>
              <p className="text-sm leading-relaxed flex-1 pt-1" style={{ color: "#d4c4b0" }}>{step}</p>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
