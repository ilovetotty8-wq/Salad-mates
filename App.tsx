import { useState, useEffect } from "react";
import { Recipe, AppUser } from "./recipe-types";
import Landing from "./screens/Landing";
import Auth from "./screens/Auth";
import Subscribe from "./screens/Subscribe";
import Recipes from "./screens/Recipes";
import RecipeDetail from "./screens/RecipeDetail";
import Admin from "./screens/Admin";
import Profile from "./screens/Profile";

const S_USERS = "chef_users";
const S_RECIPES = "chef_recipes";
const S_SESSION = "chef_session";

function load<T>(key: string, fallback: T): T {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch { return fallback; }
}

type Tab = "home" | "recipes" | "profile";
type ModalScreen = "auth" | "subscribe" | "recipe-detail" | "admin" | null;

export default function App() {
  const [users, setUsers] = useState<AppUser[]>(() => load(S_USERS, []));
  const [recipes, setRecipes] = useState<Recipe[]>(() => load(S_RECIPES, []));
  const [currentUser, setCurrentUser] = useState<AppUser | null>(() => {
    const id = localStorage.getItem(S_SESSION);
    const all: AppUser[] = load(S_USERS, []);
    return id ? (all.find((u) => u.id === id) ?? null) : null;
  });
  const [tab, setTab] = useState<Tab>("home");
  const [modal, setModal] = useState<ModalScreen>(null);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  useEffect(() => { localStorage.setItem(S_USERS, JSON.stringify(users)); }, [users]);
  useEffect(() => { localStorage.setItem(S_RECIPES, JSON.stringify(recipes)); }, [recipes]);
  useEffect(() => {
    if (currentUser) localStorage.setItem(S_SESSION, currentUser.id);
    else localStorage.removeItem(S_SESSION);
  }, [currentUser]);

  function syncUser(updated: AppUser) {
    setUsers((prev) => prev.map((u) => u.id === updated.id ? updated : u));
    setCurrentUser(updated);
  }

  function handleLogin(user: AppUser) {
    const fresh = users.find((u) => u.id === user.id) ?? user;
    setCurrentUser(fresh);
    setModal(null);
    if (!fresh.subscribed) setModal("subscribe");
  }

  function handleRegister(user: AppUser) {
    setUsers((prev) => [...prev, user]);
    setCurrentUser(user);
    setModal("subscribe");
  }

  function handleSubscribed() {
    if (!currentUser) return;
    const updated = { ...currentUser, subscribed: true, subscribedAt: new Date().toISOString() };
    syncUser(updated);
    setModal(null);
    setTab("recipes");
  }

  function handleLogout() {
    setCurrentUser(null);
    setTab("home");
    setModal(null);
  }

  function saveRecipe(recipe: Recipe) {
    setRecipes((prev) => {
      const exists = prev.find((r) => r.id === recipe.id);
      return exists ? prev.map((r) => (r.id === recipe.id ? recipe : r)) : [...prev, recipe];
    });
  }

  function deleteRecipe(id: string) {
    setRecipes((prev) => prev.filter((r) => r.id !== id));
  }

  function goToRecipes() {
    if (!currentUser) { setModal("auth"); return; }
    if (!currentUser.subscribed) { setModal("subscribe"); return; }
    setTab("recipes");
    setModal(null);
  }

  // Modal screens render over the tab layout
  if (modal === "auth") {
    return (
      <Auth
        users={users}
        onLogin={handleLogin}
        onRegister={handleRegister}
        onBack={() => setModal(null)}
      />
    );
  }

  if (modal === "subscribe" && currentUser) {
    return (
      <Subscribe
        user={currentUser}
        onSubscribed={handleSubscribed}
        onBack={() => setModal(null)}
      />
    );
  }

  if (modal === "recipe-detail" && selectedRecipe) {
    return (
      <RecipeDetail
        recipe={selectedRecipe}
        onBack={() => { setModal(null); setTab("recipes"); }}
      />
    );
  }

  if (modal === "admin" && currentUser?.isAdmin) {
    return (
      <Admin
        recipes={recipes}
        onSave={saveRecipe}
        onDelete={deleteRecipe}
        onBack={() => setModal(null)}
      />
    );
  }

  return (
    <div className="size-full flex flex-col" style={{ background: "#12100d" }}>
      {/* Tab content */}
      <div className="flex-1 overflow-hidden">
        {tab === "home" && (
          <Landing
            recipes={recipes}
            user={currentUser}
            onGoAuth={() => setModal("auth")}
            onGoRecipes={goToRecipes}
            onGoSubscribe={() => setModal("subscribe")}
          />
        )}
        {tab === "recipes" && (
          currentUser?.subscribed ? (
            <Recipes
              recipes={recipes}
              onSelect={(r) => { setSelectedRecipe(r); setModal("recipe-detail"); }}
            />
          ) : (
            <div className="h-full flex flex-col items-center justify-center px-8 text-center">
              <div className="text-5xl mb-4">🔒</div>
              <h2 className="text-xl font-bold mb-2" style={{ fontFamily: "Lora, serif", color: "#f0e8dc" }}>
                Subscription required
              </h2>
              <p className="text-sm mb-6" style={{ color: "#b89a78" }}>
                Subscribe for $100 your first year (then $50/year) to unlock the full recipe library.
              </p>
              <button
                onClick={() => currentUser ? setModal("subscribe") : setModal("auth")}
                className="py-3 px-8 rounded-full text-sm font-semibold"
                style={{ background: "#c8922a", color: "#12100d" }}
              >
                {currentUser ? "Subscribe Now" : "Sign In"}
              </button>
            </div>
          )
        )}
        {tab === "profile" && (
          <Profile
            user={currentUser}
            onGoAuth={() => setModal("auth")}
            onGoSubscribe={() => setModal("subscribe")}
            onGoAdmin={() => setModal("admin")}
            onLogout={handleLogout}
          />
        )}
      </div>

      {/* Bottom tab bar */}
      <div
        className="shrink-0 flex items-center justify-around pb-safe"
        style={{
          background: "#0e0c09",
          borderTop: "1px solid #2a2018",
          paddingTop: 10,
          paddingBottom: 24,
        }}
      >
        {([
          { id: "home", icon: "🏠", label: "Home" },
          { id: "recipes", icon: "📖", label: "Recipes" },
          { id: "profile", icon: "👤", label: "Profile" },
        ] as { id: Tab; icon: string; label: string }[]).map((t) => (
          <button
            key={t.id}
            onClick={() => {
              if (t.id === "recipes" && !currentUser?.subscribed) {
                goToRecipes(); return;
              }
              setTab(t.id);
            }}
            className="flex flex-col items-center gap-0.5 px-6 active:opacity-60 transition-opacity"
          >
            <span className="text-xl">{t.icon}</span>
            <span
              className="text-xs font-medium"
              style={{ color: tab === t.id ? "#c8922a" : "#6a5a4a" }}
            >
              {t.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
