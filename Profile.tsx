import { AppUser } from "../recipe-types";

interface ProfileProps {
  user: AppUser | null;
  onGoAuth: () => void;
  onGoSubscribe: () => void;
  onGoAdmin: () => void;
  onLogout: () => void;
}

export default function Profile({ user, onGoAuth, onGoSubscribe, onGoAdmin, onLogout }: ProfileProps) {
  if (!user) {
    return (
      <div className="h-full flex flex-col items-center justify-center px-8 text-center" style={{ background: "#12100d" }}>
        <div className="text-5xl mb-4">👤</div>
        <h2 className="text-xl font-bold mb-2" style={{ fontFamily: "Lora, serif", color: "#f0e8dc" }}>
          Sign in to your account
        </h2>
        <p className="text-sm mb-6" style={{ color: "#b89a78" }}>
          Create an account to subscribe and access the full recipe library.
        </p>
        <button
          onClick={onGoAuth}
          className="w-full max-w-xs py-4 rounded-full text-sm font-semibold"
          style={{ background: "#c8922a", color: "#12100d" }}
        >
          Sign In / Create Account
        </button>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto" style={{ background: "#12100d" }}>
      <div className="px-5 pt-12 pb-6">
        <p className="text-xs tracking-widest uppercase mb-1" style={{ color: "#c8922a" }}>Account</p>
        <h2 className="text-2xl font-bold" style={{ fontFamily: "Lora, serif", color: "#f0e8dc" }}>
          {user.name}
        </h2>
        <p className="text-sm mt-0.5" style={{ color: "#b89a78" }}>{user.email}</p>
      </div>

      {/* Status card */}
      <div className="mx-5 mb-6 rounded-2xl p-5" style={{ background: "#1e1810", border: "1px solid #3a2e1e" }}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs tracking-wide mb-1" style={{ color: "#b89a78" }}>SUBSCRIPTION STATUS</p>
            {user.subscribed ? (
              <>
                <p className="text-base font-semibold" style={{ color: "#7ec87e" }}>✓ Active</p>
                {user.subscribedAt && (
                  <p className="text-xs mt-0.5" style={{ color: "#6a5a4a" }}>
                    Since {new Date(user.subscribedAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                  </p>
                )}
              </>
            ) : (
              <p className="text-base font-semibold" style={{ color: "#b89a78" }}>Not subscribed</p>
            )}
          </div>
          {!user.subscribed && (
            <button
              onClick={onGoSubscribe}
              className="px-4 py-2 rounded-full text-xs font-semibold"
              style={{ background: "#c8922a", color: "#12100d" }}
            >
              Subscribe $100
            </button>
          )}
        </div>
      </div>

      {/* Menu items */}
      <div className="mx-5 rounded-2xl overflow-hidden" style={{ background: "#1e1810", border: "1px solid #3a2e1e" }}>
        {user.isAdmin && (
          <button
            onClick={onGoAdmin}
            className="w-full flex items-center justify-between px-5 py-4 text-sm border-b active:opacity-70"
            style={{ color: "#f0e8dc", borderColor: "#3a2e1e" }}
          >
            <span className="flex items-center gap-3">
              <span>🍳</span> Chef Admin Panel
            </span>
            <span style={{ color: "#6a5a4a" }}>→</span>
          </button>
        )}
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-between px-5 py-4 text-sm active:opacity-70"
          style={{ color: "#e07060" }}
        >
          <span className="flex items-center gap-3">
            <span>↩</span> Sign Out
          </span>
        </button>
      </div>

      <div className="h-24" />
    </div>
  );
}
