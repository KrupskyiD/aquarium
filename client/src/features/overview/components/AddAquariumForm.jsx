import { Check, ChevronLeft, Fish } from "lucide-react";
import { useMemo, useState } from "react";
import Button from "../../../shared/components/Button";

const AddAquariumForm = ({ onCancel, onAdd }) => {
  const [name, setName] = useState("");
  const [volumeLiters, setVolumeLiters] = useState("");
  const [aquariumType, setAquariumType] = useState("marine");
  const [deviceNumber, setDeviceNumber] = useState("");

  const isVolumeValid = useMemo(() => /^\d+$/.test(volumeLiters) && Number(volumeLiters) > 0, [volumeLiters]);

  const handleVolumeChange = (event) => {
    const numericValue = event.target.value.replace(/\D/g, "");
    setVolumeLiters(numericValue);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const formData = {
      name: name.trim(),
      volume: parseInt(volumeLiters, 10),
      type: aquariumType,
      device_number: deviceNumber.trim(),
    };

    onAdd?.(formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto w-full max-w-[520px] rounded-2xl border border-[#1a2346] bg-[#0f1630] p-5 sm:p-6"
    >
      <header className="mb-6 flex items-center gap-3">
        <button
          type="button"
          onClick={onCancel}
          aria-label="Zpět"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#24335f] bg-[#0b152b] text-slate-300 transition-colors hover:text-white"
        >
          <ChevronLeft size={20} />
        </button>
        <h2 className="text-2xl font-bold text-white">Přidat akvárium</h2>
      </header>

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

      <div className="mt-8 space-y-3">
        <Button type="submit">Přidat a připojit</Button>
        <button
          type="button"
          onClick={onCancel}
          className="w-full rounded-xl border border-[#2a3f73] bg-[#101a33] px-6 py-3 text-base font-semibold text-slate-200 transition-colors hover:bg-[#162341]"
        >
          Zrušit
        </button>
      </div>
    </form>
  );
};

export default AddAquariumForm;
