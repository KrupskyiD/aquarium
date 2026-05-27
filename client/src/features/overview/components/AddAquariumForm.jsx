import { Check, ChevronLeft, Fish, Minus, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import Button from "../../../shared/components/Button";

const DEFAULT_THRESHOLD = 30;

const ThresholdInput = ({ label, value, onChange, step = 1 }) => {
  const numericValue = Number(value);

  const adjust = (delta) => {
    const next = Number.isFinite(numericValue) ? numericValue + delta : DEFAULT_THRESHOLD;
    onChange(String(Math.round(next * 10) / 10));
  };

  const handleChange = (event) => {
    const raw = event.target.value.replace(",", ".");
    if (raw === "" || /^\d*\.?\d*$/.test(raw)) {
      onChange(raw);
    }
  };

  return (
    <div>
      <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.08em] text-slate-400">
        {label}
      </label>
      <div className="flex items-stretch overflow-hidden rounded-xl border border-[#24335f] bg-[#0a1428]">
        <button
          type="button"
          onClick={() => adjust(-step)}
          aria-label={`Snížit ${label}`}
          className="flex w-11 shrink-0 items-center justify-center text-slate-400 transition-colors hover:bg-[#121f38] hover:text-white"
        >
          <Minus size={16} />
        </button>
        <input
          type="text"
          inputMode="decimal"
          value={value}
          onChange={handleChange}
          className="min-w-0 flex-1 border-x border-[#24335f] bg-transparent py-3 text-center text-lg font-semibold text-white outline-none"
        />
        <button
          type="button"
          onClick={() => adjust(step)}
          aria-label={`Zvýšit ${label}`}
          className="flex w-11 shrink-0 items-center justify-center text-slate-400 transition-colors hover:bg-[#121f38] hover:text-white"
        >
          <Plus size={16} />
        </button>
      </div>
    </div>
  );
};

const AddAquariumForm = ({ onCancel, onAdd }) => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [volumeLiters, setVolumeLiters] = useState("");
  const [aquariumType, setAquariumType] = useState("marine");
  const [deviceNumber, setDeviceNumber] = useState("");
  const [minSalt, setMinSalt] = useState(String(DEFAULT_THRESHOLD));
  const [maxSalt, setMaxSalt] = useState(String(DEFAULT_THRESHOLD));
  const [minTemp, setMinTemp] = useState(String(DEFAULT_THRESHOLD));
  const [maxTemp, setMaxTemp] = useState(String(DEFAULT_THRESHOLD));
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const isVolumeValid = useMemo(
    () => /^\d+$/.test(volumeLiters) && Number(volumeLiters) > 0,
    [volumeLiters],
  );

  const isStep1Valid = useMemo(
    () => name.trim().length > 0 && isVolumeValid && deviceNumber.trim().length > 0,
    [name, isVolumeValid, deviceNumber],
  );

  const isStep2Valid = useMemo(() => {
    const minSaltNum = parseFloat(minSalt);
    const maxSaltNum = parseFloat(maxSalt);
    const minTempNum = parseFloat(minTemp);
    const maxTempNum = parseFloat(maxTemp);

    return (
      Number.isFinite(minSaltNum) &&
      Number.isFinite(maxSaltNum) &&
      Number.isFinite(minTempNum) &&
      Number.isFinite(maxTempNum) &&
      maxSaltNum >= minSaltNum &&
      maxTempNum >= minTempNum
    );
  }, [minSalt, maxSalt, minTemp, maxTemp]);

  const handleVolumeChange = (event) => {
    const numericValue = event.target.value.replace(/\D/g, "");
    setVolumeLiters(numericValue);
  };

  const handleBack = () => {
    if (step === 2) {
      setSubmitError("");
      setStep(1);
      return;
    }
    onCancel?.();
  };

  const handleContinue = (event) => {
    event.preventDefault();
    if (!isStep1Valid) return;
    setSubmitError("");
    setStep(2);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (submitting || !isStep2Valid) return;

    const formData = {
      name: name.trim(),
      volume: parseInt(volumeLiters, 10),
      type: aquariumType,
      device_number: deviceNumber.trim(),
      min_salt: parseFloat(minSalt),
      max_salt: parseFloat(maxSalt),
      min_temp: parseFloat(minTemp),
      max_temp: parseFloat(maxTemp),
    };

    setSubmitError("");
    setSubmitting(true);
    try {
      await onAdd?.(formData);
      setStep(1);
    } catch (error) {
      setSubmitError(error?.message || "Přidání akvária se nepodařilo.");
    } finally {
      setSubmitting(false);
    }
  };

  const step1Fields = (
    <div className="space-y-5">
      <div>
        <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.08em] text-slate-400">
          NÁZEV AKVÁRIA:*
        </label>
        <div className="relative">
          <Fish size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            required
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Např. Reef One"
            className="w-full rounded-xl border border-[#24335f] bg-[#0a1428] py-3 pl-11 pr-4 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.08em] text-slate-400">
          OBJEM (LITRY):*
        </label>
        <div className="relative">
          <input
            required
            type="number"
            inputMode="numeric"
            value={volumeLiters}
            onChange={handleVolumeChange}
            placeholder="Např. 120"
            className="w-full rounded-xl border border-[#24335f] bg-[#0a1428] py-3 pl-4 pr-12 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-blue-500"
          />
          {isVolumeValid ? (
            <Check
              size={18}
              className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-emerald-400"
            />
          ) : null}
        </div>
      </div>

      <div>
        <p className="mb-2 block text-xs font-semibold uppercase tracking-[0.08em] text-slate-400">
          TYP AKVÁRIA:
        </p>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setAquariumType("marine")}
            className={`rounded-xl border px-4 py-3 text-sm font-semibold transition ${
              aquariumType === "marine"
                ? "border-blue-500 bg-blue-600 text-white"
                : "border-[#24335f] bg-[#0a1428] text-slate-300"
            }`}
          >
            Mořské
          </button>
          <button
            type="button"
            onClick={() => setAquariumType("freshwater")}
            className={`rounded-xl border px-4 py-3 text-sm font-semibold transition ${
              aquariumType === "freshwater"
                ? "border-blue-500 bg-blue-600 text-white"
                : "border-[#24335f] bg-[#0a1428] text-slate-300"
            }`}
          >
            Sladkovodní
          </button>
        </div>
      </div>

      <div>
        <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.08em] text-slate-400">
          ČÍSLO ZAŘÍZENÍ:*
        </label>
        <input
          required
          type="text"
          value={deviceNumber}
          onChange={(event) => setDeviceNumber(event.target.value)}
          placeholder="Např. 192.168.0.15"
          className="w-full rounded-xl border border-[#24335f] bg-[#0a1428] px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-blue-500"
        />
      </div>
    </div>
  );

  const step2Fields = (
    <div className="space-y-6">
      <div>
        <p className="mb-3 text-sm font-semibold text-slate-200">Salinita:</p>
        <div className="grid grid-cols-2 gap-3">
          <ThresholdInput label="Min" value={minSalt} onChange={setMinSalt} />
          <ThresholdInput label="Max" value={maxSalt} onChange={setMaxSalt} />
        </div>
      </div>

      <div>
        <p className="mb-3 text-sm font-semibold text-slate-200">Teplota:</p>
        <div className="grid grid-cols-2 gap-3">
          <ThresholdInput label="Min" value={minTemp} onChange={setMinTemp} />
          <ThresholdInput label="Max" value={maxTemp} onChange={setMaxTemp} />
        </div>
      </div>
    </div>
  );

  return (
    <form
      onSubmit={step === 1 ? handleContinue : handleSubmit}
      className="mx-auto w-full max-w-[520px] rounded-2xl border border-[#1a2346] bg-[#0f1630] p-5 transition-all duration-200 sm:p-6"
    >
      <header className="mb-6 flex items-center gap-3">
        <button
          type="button"
          onClick={handleBack}
          aria-label={step === 2 ? "Zpět na základní údaje" : "Zpět"}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#24335f] bg-[#0b152b] text-slate-300 transition-colors hover:text-white"
        >
          <ChevronLeft size={20} />
        </button>
        <h2 className="text-2xl font-bold text-white">
          {step === 1 ? "Přidat akvárium" : "Nastavení metric"}
        </h2>
      </header>

      {step === 1 ? step1Fields : step2Fields}

      {submitError ? (
        <p className="mt-4 rounded-lg border border-red-500/40 bg-red-900/20 px-3 py-2 text-sm text-red-300">
          {submitError}
        </p>
      ) : null}

      <div className="mt-8 space-y-3">
        {step === 1 ? (
          <>
            <Button type="submit" disabled={!isStep1Valid}>
              Pokračovat
            </Button>
            <button
              type="button"
              onClick={onCancel}
              className="w-full rounded-xl border border-[#2a3f73] bg-[#101a33] px-6 py-3 text-base font-semibold text-slate-200 transition-colors hover:bg-[#162341]"
            >
              Zrušit
            </button>
          </>
        ) : (
          <>
            <Button type="submit" disabled={submitting || !isStep2Valid}>
              {submitting ? "Přidávám..." : "Přidat a připojit"}
            </Button>
            <button
              type="button"
              onClick={() => {
                setSubmitError("");
                setStep(1);
              }}
              disabled={submitting}
              className="w-full rounded-xl border border-[#2a3f73] bg-[#101a33] px-6 py-3 text-base font-semibold text-slate-200 transition-colors hover:bg-[#162341] disabled:cursor-not-allowed disabled:opacity-60"
            >
              Zrušit
            </button>
          </>
        )}
      </div>
    </form>
  );
};

export default AddAquariumForm;
