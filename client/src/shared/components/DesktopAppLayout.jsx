import { Droplet, Grid2x2, User } from "lucide-react";
import { SCREENS } from "../constants/screens";

const mainNavItems = [{ id: SCREENS.AQUARIUM, label: "Moje akvária", icon: Grid2x2 }];

/**
 * Desktop dashboard shell with optional top strip (profile) or inline page header (overview).
 */
const DesktopAppLayout = ({
  title,
  subtitle,
  headerRight,
  layoutStyle = "app",
  activeScreen,
  onNavigate,
  children,
}) => {
  const showBarTitle = layoutStyle === "app" && Boolean(title);
  const showPageHeading = layoutStyle === "dashboard";

  return (
    <section className="min-h-screen bg-[#090d1a] p-4 text-white md:p-8">
      <div className="mx-auto max-w-[1180px] overflow-hidden rounded-2xl border border-[#1a2346] bg-[#0a1022] shadow-[0_20px_60px_rgba(0,0,0,0.45)]">
        {showBarTitle ? (
          <header className="flex h-12 items-center border-b border-[#1a2346] px-6 text-sm text-slate-200">
            {title}
          </header>
        ) : null}

        <div className={`flex ${showBarTitle ? "min-h-[620px]" : "min-h-[660px]"}`}>
          <aside className="hidden w-[220px] border-r border-[#1a2346] p-4 md:block">
            <div className="mb-8 flex items-center gap-2 text-sm font-semibold text-slate-200">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600/20 text-blue-400 ring-1 ring-blue-500/30">
                <Droplet size={18} className="fill-current" aria-hidden />
              </span>
              SaltGuard
            </div>

            <div className="mb-2 text-[10px] uppercase tracking-[0.14em] text-slate-500">
              Hlavní
            </div>
            {mainNavItems.map(({ id, label, icon }) => {
              const isActive = activeScreen === id;
              const NavIcon = icon;
              return (
                <button
                  key={id}
                  type="button"
                  className={`mb-1 flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors ${
                    isActive
                      ? "border border-[#2a3f8f] bg-[#12214c] text-blue-200"
                      : "text-slate-300 hover:bg-[#121a35]"
                  }`}
                  onClick={() => onNavigate?.(id)}
                >
                  <NavIcon size={14} />
                  {label}
                </button>
              );
            })}

            <div className="mb-2 mt-6 text-[10px] uppercase tracking-[0.14em] text-slate-500">
              Účet
            </div>
            <button
              type="button"
              className={`flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors ${
                activeScreen === SCREENS.PROFILE
                  ? "border border-[#2a3f8f] bg-[#12214c] text-blue-200"
                  : "text-slate-300 hover:bg-[#121a35]"
              }`}
              onClick={() => onNavigate?.(SCREENS.PROFILE)}
            >
              <User size={14} />
              Profil
            </button>
          </aside>

          <main className="flex-1 p-5 md:p-8">
            {showPageHeading ? (
              <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="min-w-0">
                  <h1 className="text-2xl font-bold tracking-tight text-white">{title}</h1>
                  {subtitle ? (
                    <p className="mt-1 text-sm text-slate-400">{subtitle}</p>
                  ) : null}
                </div>
                {headerRight ? (
                  <div className="shrink-0 md:pt-0.5">{headerRight}</div>
                ) : null}
              </div>
            ) : null}

            {children}
          </main>
        </div>
      </div>
    </section>
  );
};

export default DesktopAppLayout;
