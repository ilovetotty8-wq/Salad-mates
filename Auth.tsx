import { useState } from "react";
import { AppUser } from "../recipe-types";

interface AuthProps {
  users: AppUser[];
  onLogin: (user: AppUser) => void;
  onRegister: (user: AppUser) => void;
  onBack: () => void;
}

function genId() {
  return Math.random().toString(36).slice(2, 10);
}

export default function Auth({ users, onLogin, onRegister, onBack }: AuthProps) {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit() {
    setError("");
    const trimEmail = email.trim().toLowerCase();
    if (!trimEmail || !password) { setError("Please fill in all fields."); return; }

    if (mode === "signin") {
      const found = users.find((u) => u.email === trimEmail && u.password === password);
      if (!found) { setError("Email or password is incorrect."); return; }
      onLogin(found);
    } else {
      if (!name.trim()) { setError("Please enter your name."); return; }
      if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
      if (users.find((u) => u.email === trimEmail)) { setError("An account with that email already exists."); return; }
      const newUser: AppUser = {
        id: genId(),
        name: name.trim(),
        email: trimEmail,
        password,
        isAdmin: trimEmail === "admin@mychef.app",
        subscribed: false,
      };
      onRegister(newUser);
    }
  }

  const inputStyle = {
    background: "#1e1810",
    border: "1px solid #3a2e1e",
    borderRadius: 12,
    color: "#f0e8dc",
    padding: "14px 16px",
    fontSize: 15,
    outline: "none",
    width: "100%",
  } as React.CSSProperties;

  return (
    <div className="h-full flex flex-col" style={{ background: "#12100d" }}>
      {/* Header */}
      <div className="px-5 pt-14 pb-8">
        <button onClick={onBack} className="text-sm mb-8 flex items-center gap-1" style={{ color: "#b89a78" }}>
          ← Back
        </button>
        <p className="text-xs tracking-widest uppercase mb-2" style={{ color: "#c8922a" }}>Welcome</p>
        <h2 className="text-2xl font-bold" style={{ fontFamily: "Lora, serif", color: "#f0e8dc" }}>
          {mode === "signin" ? "Sign in to your account" : "Create your account"}
        </h2>
      </div>

      {/* Form */}
      <div className="flex-1 px-5 flex flex-col gap-4">
        {mode === "signup" && (
          <input
            style={inputStyle}
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        )}
        <input
          style={inputStyle}
          placeholder="Email address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoCapitalize="none"
        />
        <input
          style={inputStyle}
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && (
          <p className="text-sm px-1" style={{ color: "#e07060" }}>{error}</p>
        )}

        <button
          onClick={handleSubmit}
          className="w-full py-4 rounded-full text-sm font-semibold mt-2 active:opacity-80 transition-opacity"
          style={{ background: "#c8922a", color: "#12100d" }}
        >
          {mode === "signin" ? "Sign In" : "Create Account"}
        </button>

        <p className="text-center text-sm mt-2" style={{ color: "#b89a78" }}>
          {mode === "signin" ? "Don't have an account? " : "Already have an account? "}
          <button
            onClick={() => { setMode(mode === "signin" ? "signup" : "signin"); setError(""); }}
            style={{ color: "#c8922a" }}
          >
            {mode === "signin" ? "Sign up" : "Sign in"}
          </button>
        </p>

        {mode === "signup" && (
          <p className="text-xs text-center mt-4 leading-relaxed" style={{ color: "#6a5a4a" }}>
            Admin access: use admin@mychef.app to get chef upload privileges.
          </p>
        )}
      </div>
    </div>
  );
}
