import { Home, User } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

const tabs = [
  {
    path: "/aquarium",
    label: "Přehled",
    icon: Home,
    isActive: (pathname) => pathname === "/aquarium" || pathname.startsWith("/aquarium/"),
  },
  {
    path: "/profile",
    label: "Profil",
    icon: User,
    isActive: (pathname) => pathname === "/profile" || pathname.startsWith("/profile/"),
  },
];

const UserBottomNav = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 md:hidden">
      <div className="mx-auto max-w-[760px] px-4 pb-4">
        <div className="rounded-2xl border border-[#1a2346] bg-[#0d1629]/95 backdrop-blur-md shadow-[0_14px_40px_rgba(2,6,23,0.55)]">
          <div className="flex items-center justify-around py-3">
            {tabs.map((item) => {
              const { path, label, icon, isActive } = item;
              const Icon = icon;
              const active = isActive(pathname);

              return (
                <button
                  key={path}
                  type="button"
                  onClick={() => navigate(path)}
                  className={`flex flex-col items-center gap-1 transition-colors ${
                    active
                      ? "text-blue-400"
                      : "text-slate-500 hover:text-blue-300"
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
