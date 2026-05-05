import { Grid2x2, User } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

const menuItems = [
  {
    path: "/aquarium",
    label: "Moje akvária",
    icon: Grid2x2,
    isActive: (pathname) => pathname === "/aquarium" || pathname.startsWith("/aquarium/"),
  },
  {
    path: "/profile",
    label: "Profil",
    icon: User,
    isActive: (pathname) => pathname === "/profile" || pathname.startsWith("/profile/"),
  },
];

const DesktopAppLayout = ({ title, children }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <section className="min-h-screen bg-[#090d1a] text-white p-4 md:p-8">
      <div className="mx-auto max-w-[1180px] border border-[#1a2346] rounded-2xl overflow-hidden bg-[#0a1022] shadow-[0_20px_60px_rgba(0,0,0,0.45)]">
        <header className="h-12 border-b border-[#1a2346] px-6 flex items-center text-sm text-slate-200">
          {title}
        </header>

        <div className="flex min-h-[620px]">
          <aside className="w-[220px] border-r border-[#1a2346] p-4 hidden md:block">
            <div className="text-sm font-semibold text-slate-200 mb-8">SaltGuard</div>

            <div className="text-[10px] tracking-[0.14em] text-slate-500 uppercase mb-2">
              Hlavní
            </div>
            {menuItems.map((item) => {
              const { path, label, icon, isActive } = item;
              const Icon = icon;
              const active = isActive(pathname);
              return (
                <button
                  key={path}
                  type="button"
                  className={`w-full flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors ${
                    active
                      ? "border border-[#2a3f8f] bg-[#12214c] text-blue-200"
                      : "text-slate-300 hover:bg-[#121a35]"
                  }`}
                  onClick={() => navigate(path)}
                >
                  <Icon size={14} />
                  {label}
                </button>
              );
            })}
          </aside>

          <main className="flex-1 p-5 md:p-8">{children}</main>
        </div>
      </div>
    </section>
  );
};

export default DesktopAppLayout;
