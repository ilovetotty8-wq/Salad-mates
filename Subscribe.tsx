import { useState } from "react";
import { AppUser } from "../recipe-types";

interface SubscribeProps {
  user: AppUser;
  onSubscribed: () => void;
  onBack: () => void;
}

export default function Subscribe({ user, onSubscribed, onBack }: SubscribeProps) {
  const [step, setStep] = useState<"info" | "payment" | "done">("info");
  const [cardNum, setCardNum] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [name, setName] = useState(user.name);
  const [processing, setProcessing] = useState(false);

  function formatCard(val: string) {
    return val.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
  }
  function formatExpiry(val: string) {
    const d = val.replace(/\D/g, "").slice(0, 4);
    return d.length >= 3 ? d.slice(0, 2) + "/" + d.slice(2) : d;
  }

  function handlePay() {
    if (!cardNum || !expiry || !cvv || !name) return;
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setStep("done");
      setTimeout(onSubscribed, 1800);
    }, 1800);
  }

  if (step === "done") {
    return (
      <div className="h-full flex flex-col items-center justify-center px-8 text-center" style={{ background: "#12100d" }}>
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center text-3xl mb-6"
          style={{ background: "#1e1810", border: "2px solid #c8922a" }}
        >
          🎉
        </div>
        <h2 className="text-2xl font-bold mb-3" style={{ fontFamily: "Lora, serif", color: "#f0e8dc" }}>
          You're in!
        </h2>
        <p className="text-sm leading-relaxed" style={{ color: "#b89a78" }}>
          Welcome to the chef's collection. Your full recipe library is now unlocked.
        </p>
      </div>
    );
  }

  if (step === "payment") {
    return (
      <div className="h-full flex flex-col" style={{ background: "#12100d" }}>
        <div className="px-5 pt-14 pb-6">
          <button onClick={() => setStep("info")} className="text-sm mb-8 flex items-center gap-1" style={{ color: "#b89a78" }}>
            ← Back
          </button>
          <p className="text-xs tracking-widest uppercase mb-2" style={{ color: "#c8922a" }}>Secure Payment</p>
          <h2 className="text-2xl font-bold" style={{ fontFamily: "Lora, serif", color: "#f0e8dc" }}>
            First year<br />— $100.00
          </h2>
          <p className="text-xs mt-1" style={{ color: "#b89a78" }}>$50/year from year 2 onward</p>
        </div>

        <div className="flex-1 px-5 flex flex-col gap-4 overflow-y-auto">
          {[
            { label: "Name on card", value: name, setter: setName, placeholder: "Full name", type: "text" },
          ].map((f) => (
            <div key={f.label}>
              <p className="text-xs mb-2 tracking-wide" style={{ color: "#b89a78" }}>{f.label.toUpperCase()}</p>
              <input
                type={f.type}
                value={f.value}
                onChange={(e) => f.setter(e.target.value)}
                placeholder={f.placeholder}
                style={{
                  background: "#1e1810", border: "1px solid #3a2e1e", borderRadius: 12,
                  color: "#f0e8dc", padding: "14px 16px", fontSize: 15, outline: "none", width: "100%",
                }}
              />
            </div>
          ))}

          <div>
            <p className="text-xs mb-2 tracking-wide" style={{ color: "#b89a78" }}>CARD NUMBER</p>
            <input
              type="text"
              inputMode="numeric"
              value={cardNum}
              onChange={(e) => setCardNum(formatCard(e.target.value))}
              placeholder="1234 5678 9012 3456"
              style={{
                background: "#1e1810", border: "1px solid #3a2e1e", borderRadius: 12,
                color: "#f0e8dc", padding: "14px 16px", fontSize: 15, outline: "none", width: "100%",
                fontFamily: "monospace", letterSpacing: "0.1em",
              }}
            />
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <p className="text-xs mb-2 tracking-wide" style={{ color: "#b89a78" }}>EXPIRY</p>
              <input
                type="text"
                inputMode="numeric"
                value={expiry}
                onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                placeholder="MM/YY"
                style={{
                  background: "#1e1810", border: "1px solid #3a2e1e", borderRadius: 12,
                  color: "#f0e8dc", padding: "14px 16px", fontSize: 15, outline: "none", width: "100%",
                  fontFamily: "monospace",
                }}
              />
            </div>
            <div style={{ width: 100 }}>
              <p className="text-xs mb-2 tracking-wide" style={{ color: "#b89a78" }}>CVV</p>
              <input
                type="text"
                inputMode="numeric"
                value={cvv}
                onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                placeholder="•••"
                style={{
                  background: "#1e1810", border: "1px solid #3a2e1e", borderRadius: 12,
                  color: "#f0e8dc", padding: "14px 16px", fontSize: 15, outline: "none", width: "100%",
                  fontFamily: "monospace",
                }}
              />
            </div>
          </div>

          <button
            onClick={handlePay}
            disabled={processing || !cardNum || !expiry || !cvv || !name}
            className="w-full py-4 rounded-full text-sm font-semibold mt-2 disabled:opacity-50 transition-opacity active:opacity-80"
            style={{ background: "#c8922a", color: "#12100d" }}
          >
            {processing ? "Processing…" : "Pay $100.00"}
          </button>

          <p className="text-xs text-center pb-8" style={{ color: "#6a5a4a" }}>
            🔒 Demo mode — no real charge will be made
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col" style={{ background: "#12100d" }}>
      <div className="px-5 pt-14 pb-6">
        <button onClick={onBack} className="text-sm mb-8 flex items-center gap-1" style={{ color: "#b89a78" }}>
          ← Back
        </button>
        <p className="text-xs tracking-widest uppercase mb-2" style={{ color: "#c8922a" }}>Unlock Everything</p>
        <h2 className="text-2xl font-bold" style={{ fontFamily: "Lora, serif", color: "#f0e8dc" }}>
          Get full access to the chef's collection
        </h2>
      </div>

      <div className="flex-1 px-5 overflow-y-auto flex flex-col gap-5">
        <div
          className="rounded-2xl p-5"
          style={{ background: "#1e1810", border: "1px solid #3a2e1e" }}
        >
          <div className="mb-4">
            <p className="text-xs tracking-widest uppercase mb-3" style={{ color: "#c8922a" }}>Subscription Pricing</p>
            <div className="flex gap-3">
              <div className="flex-1 rounded-xl p-3 text-center" style={{ background: "#2a2018", border: "1px solid #c8922a44" }}>
                <p className="text-xs mb-1" style={{ color: "#b89a78" }}>Year 1</p>
                <p className="text-2xl font-bold" style={{ fontFamily: "Lora, serif", color: "#f0e8dc" }}>$100</p>
              </div>
              <div className="flex-1 rounded-xl p-3 text-center" style={{ background: "#1e1810" }}>
                <p className="text-xs mb-1" style={{ color: "#b89a78" }}>Year 2+</p>
                <p className="text-2xl font-bold" style={{ fontFamily: "Lora, serif", color: "#c8922a" }}>$50</p>
              </div>
            </div>
          </div>
          <div className="h-px mb-4" style={{ background: "#3a2e1e" }} />
          <ul className="flex flex-col gap-3">
            {[
              "Full recipe library — Cooking, Baking & Desserts",
              "New recipes added every year",
              "Chef notes, tips & substitutions",
              "HD photos for every recipe",
              "Access on any device, anytime",
            ].map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm" style={{ color: "#d4c4b0" }}>
                <span className="mt-0.5" style={{ color: "#c8922a" }}>✓</span>
                {f}
              </li>
            ))}
          </ul>
        </div>

        <button
          onClick={() => setStep("payment")}
          className="w-full py-4 rounded-full text-sm font-semibold active:opacity-80 transition-opacity"
          style={{ background: "#c8922a", color: "#12100d" }}
        >
          Continue — Pay $100 First Year
        </button>

        <p className="text-xs text-center pb-8" style={{ color: "#6a5a4a" }}>
          Signed in as {user.email}
        </p>
      </div>
    </div>
  );
}
