import DesktopAppLayout from "../../../shared/components/DesktopAppLayout";
import { SCREENS } from "../../../shared/constants/screens";

const appItems = [
  { label: "Název", value: "SaltGuard" },
  { label: "Verze", value: "v1.0.0" },
  { label: "Typ", value: "IoT monitoring akvária" },
];

const AboutAppPage = ({ onNavigate }) => {
  const content = (
    <div className="mx-auto w-full max-w-[560px] rounded-2xl border border-[#1a2346] bg-[#0f1630] p-5 sm:p-6">
      <header className="mb-6 flex items-center gap-3">
        <button
          type="button"
          onClick={() => onNavigate(SCREENS.PROFILE)}
          aria-label="Zpět"
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#24335f] bg-[#0b152b] text-slate-300 transition-colors hover:text-white"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <h1 className="text-2xl font-bold text-white">O aplikaci</h1>
      </header>

      <p className="mb-6 text-sm leading-6 text-slate-300">
        SaltGuard je aplikace pro vzdálený dohled nad mořským akváriem v reálném čase.
        Umožňuje sledovat hodnoty salinity a teploty, spravovat akvária a udržovat
        bezpečné limity.
      </p>

      <div className="overflow-hidden rounded-xl border border-[#1a2346] bg-[#0b152b]">
        {appItems.map((item, index) => (
          <div
            key={item.label}
            className={`flex items-center justify-between px-4 py-3 ${
              index !== appItems.length - 1 ? "border-b border-[#1a2346]" : ""
            }`}
          >
            <span className="text-sm text-slate-400">{item.label}</span>
            <span className="text-sm font-semibold text-slate-100">{item.value}</span>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => onNavigate(SCREENS.PROFILE)}
        className="mt-6 w-full rounded-xl border border-[#2a3f73] bg-[#101a33] px-6 py-3 text-lg font-semibold text-slate-200 transition-colors hover:bg-[#162341]"
      >
        Zpět na profil
      </button>
    </div>
  );

  return (
    <>
      <section className="min-h-screen bg-[#0B1120] px-5 pb-20 pt-8 text-white md:hidden">
        {content}
      </section>
      <div className="hidden md:block">
        <DesktopAppLayout
          title="O aplikaci"
          activeScreen={SCREENS.PROFILE}
          onNavigate={onNavigate}
        >
          {content}
        </DesktopAppLayout>
      </div>
    </>
  );
};

export default AboutAppPage;
