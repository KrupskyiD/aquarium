import { useEffect, useMemo, useState } from "react";
import DesktopAppLayout from "../../../shared/components/DesktopAppLayout";
import { SCREENS } from "../../../shared/constants/screens";

const formatCzechDate = (date = new Date()) =>
  date.toLocaleDateString("cs-CZ", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
  });

const STEPS = [
  {
    key: "idle",
    title: "Kalibrace senzoru salinity",
    subtitle: "Vstupní stav",
    chip: "Vstupní stav",
    headline: "Vstupní stav",
    timer: "",
    rows: [
      ["Senzor ID", "AS-4121"],
      ["Poslední kalibrace", "27. 4. 2026"],
      ["Příští kalibrace", "27. 5. 2026"],
    ],
    note: "Modul je připravený pro zahájení kalibrace.",
    cta: "Kalibrovat senzor",
  },
  {
    key: "prep",
    title: "Kalibrace senzoru salinity",
    subtitle: "Kalibrace",
    chip: "Příprava senzoru",
    headline: "Připrav senzor",
    timer: "",
    rows: [
      ["Vyjměte senzor z držáku", "Očistěte a osušte sondu před ponořením."],
      [
        "Opláchněte destilovanou vodou",
        "Odstraňte zbytky soli, aby měření nebylo zkreslené.",
      ],
      [
        "Ponořte kalibrační sondu",
        "Až po vyrovnání teploty pokračujte krokem 2.",
      ],
    ],
    note: "Jakmile je senzor připravený, pokračujte na další krok.",
    cta: "Pokračovat na krok 2",
  },
  {
    key: "measure",
    title: "Kalibrace senzoru salinity",
    subtitle: "Kalibrace",
    chip: "Kalibrace",
    headline: "Ponořte senzor",
    timer: "0:42",
    rows: [
      ["Aktuální hodnota", "35.7 ppt"],
      ["Referenční cíl", "35.0 ppt"],
      ["Odchylka", "+0.7 ppt"],
    ],
    note: "Zadejte referenční hodnotu a po doběhnutí časovače spusťte kalibraci.",
    cta: "Spustit kalibraci",
  },
  {
    key: "progress",
    title: "Kalibrace senzoru salinity",
    subtitle: "Kalibrace",
    chip: "Kalibrace",
    headline: "Probíhá kalibrace...",
    timer: "",
    rows: [
      ["Analýza vstupní hodnoty", "Hotovo"],
      ["Výpočet korekce", "Probíhá"],
      ["Zápis do paměti", "Čeká"],
    ],
    note: "Nevypínejte zařízení. Tento krok může trvat několik sekund.",
    cta: "Dokončit kalibraci",
  },
  {
    key: "success",
    title: "Kalibrace dokončena",
    subtitle: "Úspěšná kalibrace",
    chip: "Úspěšná kalibrace",
    headline: "Kalibrace dokončena",
    timer: "",
    rows: [
      ["Referenční hodnota", "35 ppt"],
      ["Dnešní datum kalibrace", formatCzechDate()],
      ["Přesnost senzoru", "± 0.2 ppt"],
    ],
    note: "Senzor byl úspěšně kalibrován.",
    cta: "Zpět na přehled",
  },
];

const ERROR_STEP = {
  key: "error",
  title: "Kalibrace selhala",
  subtitle: "Neúspěšná kalibrace",
  chip: "Neúspěšná kalibrace",
  headline: "Kalibrace selhala",
  timer: "",
  rows: [
    ["Kód chyby", "CAL-104"],
    ["Poslední pokus", "7. 7. 2025"],
    ["Doporučení", "Zkontrolujte sondu, kabeláž a zkuste znovu."],
  ],
  note: "Nepodařilo se dokončit kalibraci. Odstraňte problém a opakujte postup.",
  cta: "Zkusit znovu",
};

const DotProgress = ({ current }) => (
  <div className="flex items-center justify-center gap-2">
    {STEPS.map((step, index) => (
      <div
        key={step.key}
        className={`h-2.5 w-2.5 rounded-full transition-colors ${
          index <= current ? "bg-blue-500" : "bg-slate-700"
        }`}
      />
    ))}
  </div>
);

const StatusIcon = ({ success, error }) => {
  if (success) {
    return (
      <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full border border-emerald-400/40 bg-emerald-500/15 text-emerald-300">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
        >
          <path d="M5 13l4 4L19 7" />
        </svg>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full border border-rose-400/40 bg-rose-500/15 text-rose-300">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.3"
        >
          <path d="M12 8v5" />
          <circle cx="12" cy="16.5" r="0.8" fill="currentColor" />
          <path d="M12 3 2.5 20h19L12 3Z" />
        </svg>
      </div>
    );
  }

  return null;
};

const RowValue = ({ value }) => {
  if (value === "Hotovo")
    return (
      <span className="text-xs font-semibold text-emerald-300">{value}</span>
    );
  if (value === "Probíhá")
    return <span className="text-xs font-semibold text-sky-300">{value}</span>;
  if (value === "Čeká")
    return (
      <span className="text-xs font-semibold text-slate-300">{value}</span>
    );
  return <span className="text-xs font-semibold text-slate-200">{value}</span>;
};

const formatCountdown = (totalSeconds) => {
  const safeSeconds = Math.max(0, totalSeconds);
  const minutes = Math.floor(safeSeconds / 60);
  const seconds = safeSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
};

const SalinityCalibrationPage = ({ aquarium, onNavigate }) => {
  const [index, setIndex] = useState(0);
  const [failed, setFailed] = useState(false);
  const [measureSecondsLeft, setMeasureSecondsLeft] = useState(60);
  const step = failed ? ERROR_STEP : STEPS[index];
  const isSuccess = step.key === "success";
  const canGoBack = !failed && !isSuccess && index > 0;
  const progressIndex = failed ? 4 : Math.min(index, 4);
  const isMeasureStep = step.key === "measure";

  const actionLabel = useMemo(() => step.cta, [step]);

  useEffect(() => {
    if (!isMeasureStep || measureSecondsLeft <= 0) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setMeasureSecondsLeft((previous) => {
        if (previous <= 1) {
          window.clearInterval(intervalId);
          return 0;
        }
        return previous - 1;
      });
    }, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [isMeasureStep, measureSecondsLeft]);

  const handlePrimaryAction = () => {
    if (failed) {
      setFailed(false);
      setMeasureSecondsLeft(60);
      setIndex(0);
      return;
    }

    if (isSuccess) {
      onNavigate?.(SCREENS.DETAIL, undefined, { aquariumId: aquarium?.id });
      return;
    }

    if (step.key === "prep") {
      setMeasureSecondsLeft(60);
    }

    setIndex((prev) => prev + 1);
  };

  const handleBack = () => {
    setIndex((prev) => {
      const nextIndex = Math.max(0, prev - 1);
      if (nextIndex === 2) {
        setMeasureSecondsLeft(60);
      }
      return nextIndex;
    });
  };

  const content = (
    <div className="mx-auto w-full max-w-[430px] rounded-[26px] border border-[#1a2b4d] bg-[#0b162d] p-5 shadow-[0_26px_60px_rgba(1,8,22,0.55)] sm:p-6">
      <header className="mb-5 flex items-center gap-3">
        <button
          type="button"
          onClick={() =>
            onNavigate?.(SCREENS.DETAIL, undefined, {
              aquariumId: aquarium?.id,
            })
          }
          aria-label="Zpět"
          className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[#22345e] bg-[#0d1a34] text-slate-300 transition-colors hover:text-white"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <div className="min-w-0">
          <h1 className="truncate text-[30px] leading-[1.05] font-bold text-white">
            {step.title}
          </h1>
          <p className="text-[11px] font-semibold uppercase tracking-[0.13em] text-slate-400">
            {step.subtitle}
          </p>
        </div>
      </header>

      {!isSuccess && !failed ? <DotProgress current={progressIndex} /> : null}

      <div className="mt-5 rounded-2xl border border-[#22345e] bg-[#0a152c] p-4">
        <StatusIcon success={isSuccess} error={failed} />

        <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">
          {step.chip}
        </div>
        <p className="mt-2 text-2xl font-semibold text-slate-100">
          {step.headline}
        </p>

        {step.timer ? (
          <div className="mt-3 rounded-xl border border-[#1f2f54] bg-[#0c1b34] px-3 py-2">
            <div className="text-[10px] uppercase tracking-[0.12em] text-slate-500">
              Čas do stabilizace
            </div>
            <div className="text-5xl font-semibold leading-none text-blue-400">
              {isMeasureStep ? formatCountdown(measureSecondsLeft) : step.timer}
            </div>
          </div>
        ) : null}

        <div className="mt-4 space-y-2">
          {step.rows.map(([label, value]) => (
            <div
              key={label}
              className="flex items-center justify-between rounded-lg border border-[#1f2f54] bg-[#0c1b34] px-3 py-2"
            >
              <span className="text-xs text-slate-400">{label}</span>
              <RowValue value={value} />
            </div>
          ))}
        </div>

        <p className="mt-3 text-xs text-slate-400">{step.note}</p>
      </div>

      <div className="mt-6 flex flex-col gap-3">
        <button
          type="button"
          onClick={handlePrimaryAction}
          className="w-full rounded-xl bg-[#3b82f6] px-5 py-3 text-base font-semibold text-white transition-colors hover:bg-[#4d8fff]"
        >
          {actionLabel}
        </button>

        {canGoBack ? (
          <button
            type="button"
            onClick={handleBack}
            className="w-full rounded-xl border border-[#2a3f73] bg-[#101a33] px-5 py-3 text-base font-semibold text-slate-200 transition-colors hover:bg-[#162341]"
          >
            Zpět
          </button>
        ) : null}

        {failed ? (
          <button
            type="button"
            onClick={() => onNavigate?.(SCREENS.PROFILE)}
            className="w-full rounded-xl border border-[#2a3f73] bg-[#101a33] px-5 py-3 text-base font-semibold text-slate-200 transition-colors hover:bg-[#162341]"
          >
            Zpět na profil
          </button>
        ) : null}
      </div>
    </div>
  );

  return (
    <>
      <section className="min-h-screen bg-[#0B1120] px-5 pb-20 pt-8 text-white md:hidden">
        {content}
      </section>
      <div className="hidden md:block">
        <DesktopAppLayout
          title="Kalibrace salinity"
          activeScreen={SCREENS.DETAIL}
          onNavigate={onNavigate}
        >
          {content}
        </DesktopAppLayout>
      </div>
    </>
  );
};

export default SalinityCalibrationPage;
