import { Home, User } from "lucide-react";
import { SCREENS } from "../constants/screens";

const tabs = [
  { id: SCREENS.AQUARIUM, label: "Přehled", icon: Home },
  { id: SCREENS.PROFILE, label: "Profil", icon: User },
];

const UserBottomNav = ({ currentScreen, onNavigate }) => {
  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 md:hidden">
      <div className="mx-auto max-w-[760px] px-4 pb-4">
        <div className="rounded-2xl border border-[var(--auth-input-border)] bg-[color-mix(in_oklab,var(--auth-input-bg)_84%,black_16%)] backdrop-blur-md shadow-[0_14px_40px_rgba(2,6,23,0.45)]">
          <div className="flex items-center justify-around py-3">
            {tabs.map(({ id, label, icon: Icon }) => {
              const active = currentScreen === id;

              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => onNavigate?.(id)}
                  className={`flex flex-col items-center gap-1 transition-colors ${
                    active
                      ? "text-[var(--auth-link)]"
                      : "text-[var(--auth-text-muted)] hover:text-[var(--auth-brand-primary)]"
                  }`}
                >
                  <Icon size={18} />
                  <span className="text-[11px] font-semibold">{label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default UserBottomNav;
