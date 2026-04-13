import DesktopAppLayout from "./DesktopAppLayout";

/**
 * Responsive shell: desktop sidebar layout + mobile full-bleed with bottom navigation.
 */
const AppLayout = ({
  children,
  title,
  subtitle,
  headerRight,
  layoutStyle = "app",
  activeScreen,
  onNavigate,
}) => {
  return (
    <>
      <div className="hidden md:block">
        <DesktopAppLayout
          title={title}
          subtitle={subtitle}
          headerRight={headerRight}
          layoutStyle={layoutStyle}
          activeScreen={activeScreen}
          onNavigate={onNavigate}
        >
          {children}
        </DesktopAppLayout>
      </div>

      <div className="block min-h-screen bg-[#090d1a] pb-24 md:hidden">
        <header className="flex items-start justify-between gap-4 px-6 pb-2 pt-6">
          <div className="min-w-0">
            <h1 className="text-2xl font-bold text-white">{title}</h1>
            {subtitle ? (
              <p className="mt-1 text-sm text-slate-400">{subtitle}</p>
            ) : null}
          </div>
          {headerRight ? (
            <div className="shrink-0 pt-0.5">{headerRight}</div>
          ) : null}
        </header>

        <main className="px-6">{children}</main>
      </div>
    </>
  );
};

export default AppLayout;
