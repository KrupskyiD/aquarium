import { CircleHelp, Lock, LogOut, UserRound } from "lucide-react";
import { useState } from "react";
import { SCREENS } from "../../../shared/constants/screens";
import { logoutAuth } from "../../auth/api/authApi";
import DesktopAppLayout from "../../../shared/components/DesktopAppLayout";

const ProfilePage = ({ onNavigate, authUser, accessToken, onLogout }) => {
  const [logoutLoading, setLogoutLoading] = useState(false);

  const initials =
    authUser?.name
      ?.split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "U";

  const user = {
    initials,
    name: authUser?.name || "Uživatel",
    email: authUser?.email || "Neznámý e-mail",
  };

  const RowLink = ({ icon, label, suffix, onClick, danger = false, noArrow = false }) => (
    <button
      type="button"
      onClick={onClick}
      className="w-full flex items-center gap-3 px-4 py-3 text-left text-sm hover:bg-[#121a35] transition-colors"
    >
      {icon ? (
        <span className="text-slate-300">{icon}</span>
      ) : (
        <span className="w-4" />
      )}
      <span className={`flex-1 ${danger ? "text-red-400" : "text-slate-200"}`}>{label}</span>
      {suffix ? <span className="text-xs text-slate-500">{suffix}</span> : null}
      {!noArrow ? <span className="text-slate-600">›</span> : null}
    </button>
  );

  const handleLogout = async () => {
    if (logoutLoading) return;
    setLogoutLoading(true);
    try {
      if (accessToken) {
        await logoutAuth(accessToken);
      }
    } catch {
      // Logout should still clear local session even if request fails.
    } finally {
      setLogoutLoading(false);
      onLogout?.();
    }
  };

  return (
    <DesktopAppLayout
      title="Profil"
      activeScreen={SCREENS.PROFILE}
      onNavigate={onNavigate}
    >
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-full border border-[#3659cc] bg-[#13214b] text-blue-200 flex items-center justify-center font-semibold">
          {user.initials}
        </div>
        <div>
          <h2 className="text-xl font-semibold text-slate-100">{user.name}</h2>
          <p className="text-sm text-slate-400">{user.email}</p>
        </div>
      </div>

      <div className="max-w-[560px] space-y-5">
        <section>
          <h3 className="text-[11px] tracking-[0.12em] text-slate-500 uppercase mb-2">
            Účet
          </h3>
          <div className="rounded-xl border border-[#1a2346] bg-[#0f1630] overflow-hidden divide-y divide-[#1a2346]">
            <RowLink
              icon={<UserRound size={16} />}
              label="Upravit profil"
              onClick={() => {}}
            />
            <RowLink
              icon={<Lock size={16} />}
              label="Změnit heslo"
              onClick={() => {}}
            />
          </div>
        </section>

        <section>
          <h3 className="text-[11px] tracking-[0.12em] text-slate-500 uppercase mb-2">
            Aplikace
          </h3>
          <div className="rounded-xl border border-[#1a2346] bg-[#0f1630] overflow-hidden divide-y divide-[#1a2346]">
            <RowLink
              icon={<CircleHelp size={16} />}
              label="O aplikaci"
              suffix="v1.0.0"
              onClick={() => {}}
            />
            <RowLink
              icon={<LogOut size={16} />}
              label={logoutLoading ? "Odhlašuji..." : "Odhlásit se"}
              onClick={handleLogout}
              danger
              noArrow
            />
          </div>
        </section>
      </div>
    </DesktopAppLayout>
  );
};

export default ProfilePage;