import { Recipe, AppUser } from "../recipe-types";

const HERO_IMG = "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=600&fit=crop&auto=format";
const PREVIEW_IMGS = [
  "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=400&h=300&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&h=300&fit=crop&auto=format",
];

interface LandingProps {
  recipes: Recipe[];
  user: AppUser | null;
  onGoAuth: () => void;
  onGoRecipes: () => void;
  onGoSubscribe: () => void;
}

export default function Landing({ recipes, user, onGoAuth, onGoRecipes, onGoSubscribe }: LandingProps) {
  const previews = recipes.length > 0 ? recipes.slice(0, 4) : null;

  return (
    <div className="h-full overflow-y-auto" style={{ background: "#12100d" }}>
      {/* Nav */}
      <div className="flex items-center justify-between px-5 pt-12 pb-4">
        <div>
          <p className="text-xs tracking-widest uppercase" style={{ color: "#b89a78" }}>Premium</p>
          <h1 className="text-xl font-bold" style={{ fontFamily: "Lora, serif", color: "#f0e8dc" }}>
            Salad Mate Chef App
          </h1>
        </div>
        {user ? (
          <button
            onClick={user.subscribed ? onGoRecipes : onGoSubscribe}
            className="px-4 py-2 text-xs font-semibold rounded-full"
            style={{ background: "#c8922a", color: "#12100d" }}
          >
            {user.subscribed ? "My Recipes" : "Subscribe"}
          </button>
        ) : (
          <button
            onClick={onGoAuth}
            className="px-4 py-2 text-xs font-semibold rounded-full"
            style={{ background: "#c8922a", color: "#12100d" }}
          >
            Sign In
          </button>
        )}
      </div>

      {/* Hero */}
      <div className="relative mx-4 rounded-2xl overflow-hidden" style={{ height: 240 }}>
        <img src={HERO_IMG} alt="Featured dish" className="w-full h-full object-cover" />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(to top, #12100dcc 60%, transparent)" }}
        />
        <div className="absolute bottom-0 left-0 p-5">
          <p className="text-xs tracking-widest uppercase mb-1" style={{ color: "#c8922a" }}>
            Premium Collection
          </p>
          <p className="text-xl font-semibold leading-tight" style={{ fontFamily: "Lora, serif", color: "#f0e8dc" }}>
            Cooking · Baking · Desserts<br />Exclusive chef recipes
          </p>
        </div>
      </div>

      {/* Value prop */}
      <div className="px-5 py-7">
        <p className="text-sm leading-relaxed" style={{ color: "#b89a78" }}>
          Unlock the full collection of hand-crafted recipes — from weeknight dinners to celebration feasts — with a single annual subscription.
        </p>
      </div>

      {/* Preview grid */}
      <div className="px-5 mb-2">
        <p className="text-xs tracking-widest uppercase mb-4" style={{ color: "#b89a78" }}>
          A taste of what's inside
        </p>
        <div className="grid grid-cols-2 gap-3">
          {(previews ?? PREVIEW_IMGS.map((img, i) => ({
            id: String(i), title: ["Herb Roasted Chicken", "Neapolitan Pizza", "Fluffy Pancakes", "Fresh Garden Salad"][i],
            imageUrl: img, category: ["Mains", "Pizza", "Breakfast", "Salads"][i]
          }))).slice(0, 4).map((r: any, i) => (
            <div
              key={r.id ?? i}
              className="relative rounded-xl overflow-hidden cursor-pointer"
              style={{ height: 150 }}
              onClick={user?.subscribed ? onGoRecipes : user ? onGoSubscribe : onGoAuth}
            >
              <img
                src={r.imageUrl ?? PREVIEW_IMGS[i % 4]}
                alt={r.title}
                className="w-full h-full object-cover"
                style={{ filter: "blur(6px) brightness(0.45)", transform: "scale(1.05)" }}
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-3">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center mb-2 text-sm"
                  style={{ background: "rgba(200,146,42,0.25)", color: "#c8922a" }}
                >
                  🔒
                </div>
                <p className="text-xs font-medium leading-tight" style={{ color: "#f0e8dc" }}>{r.title}</p>
                {r.category && (
                  <p className="text-xs mt-0.5" style={{ color: "#b89a78" }}>{r.category}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Subscription CTA */}
      <div
        className="mx-4 my-6 rounded-2xl p-6 text-center"
        style={{ background: "#1e1810", border: "1px solid #3a2e1e" }}
      >
        <p className="text-xs tracking-widest uppercase mb-2" style={{ color: "#c8922a" }}>Annual Access</p>
        <div className="flex items-end justify-center gap-3 mb-1">
          <div className="text-center">
            <p className="text-xs mb-0.5" style={{ color: "#b89a78" }}>Year 1</p>
            <p className="text-3xl font-bold" style={{ fontFamily: "Lora, serif", color: "#f0e8dc" }}>$100</p>
          </div>
          <p className="text-2xl pb-1" style={{ color: "#3a2e1e" }}>→</p>
          <div className="text-center">
            <p className="text-xs mb-0.5" style={{ color: "#b89a78" }}>Year 2+</p>
            <p className="text-3xl font-bold" style={{ fontFamily: "Lora, serif", color: "#c8922a" }}>$50</p>
          </div>
        </div>
        <p className="text-xs mb-5" style={{ color: "#b89a78" }}>Per year · Cancel anytime</p>
        <ul className="text-sm text-left mb-6 flex flex-col gap-2" style={{ color: "#d4c4b0" }}>
          {["Unlimited recipe access", "New recipes added every year", "Detailed chef notes & tips", "HD photos for every dish"].map((f) => (
            <li key={f} className="flex items-center gap-2">
              <span style={{ color: "#c8922a" }}>✓</span> {f}
            </li>
          ))}
        </ul>
        <button
          onClick={user ? (user.subscribed ? onGoRecipes : onGoSubscribe) : onGoAuth}
          className="w-full py-3 rounded-full text-sm font-semibold transition-opacity active:opacity-80"
          style={{ background: "#c8922a", color: "#12100d" }}
        >
          {user ? (user.subscribed ? "Browse Recipes →" : "Get Access — $100 First Year") : "Create Account to Subscribe"}
        </button>
      </div>

      <div className="h-8" />
    </div>
  );
}
