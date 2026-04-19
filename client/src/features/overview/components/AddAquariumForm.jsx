import { useMemo, useState } from "react";
import { AlertCircle, X } from "lucide-react";
import Button from "../../../shared/components/Button";
import Input from "../../../shared/components/Input";
import Textarea from "../../../shared/components/Textarea";

const initialForm = () => ({
  name: "",
  volumeLiters: "",
  type: "marine",
  note: "",
  deviceAddress: "",
});

/**
 * Sanitize volume field: digits only (liters as integer).
 */


const digitsOnly = (raw) => raw.replace(/\D/g, "");

/**
 * Create-aquarium form (Czech labels). Submit is handled by parent (modal or full-screen host).
 */

const AddAquariumForm = ({ onSave, onCancel }) => {
  const [form, setForm] = useState(initialForm);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleVolumeChange = (e) => {
    const cleaned = digitsOnly(e.target.value);
    setForm((prev) => ({ ...prev, volumeLiters: cleaned }));
  };

  const isValid = useMemo(() => {
    const nameOk = form.name.trim().length > 0;
    const deviceOk = form.deviceAddress.trim().length > 0;
    const volumeNum = parseInt(form.volumeLiters, 10);
    const volumeOk = Number.isFinite(volumeNum) && volumeNum >= 1;
    return nameOk && deviceOk && volumeOk;
  }, [form.name, form.deviceAddress, form.volumeLiters]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid) return;
    await onSave?.({
      name: form.name.trim(),
      volumeLiters: form.volumeLiters.trim(),
      type: form.type,
      note: form.note.trim(),
      deviceAddress: form.deviceAddress.trim(),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="text-left">
      <div className="space-y-5">
        <Input
          label="Název akvária"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Hlavní nádrž"
          required
          rightSlot={
            form.name ? (
              <button
                type="button"
                className="pointer-events-auto rounded p-1 text-slate-500 hover:text-white"
                onClick={() => setForm((p) => ({ ...p, name: "" }))}
                aria-label="Vymazat název"
              >
                <X size={18} />
              </button>
            ) : null
          }
        />

        <div>
          <label
            htmlFor="volumeLiters"
            className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400"
          >
            Objem (litry)
          </label>
          <div className="flex overflow-hidden rounded-xl border border-[#1e293b] bg-[#1e293b]/80 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
            <input
              id="volumeLiters"
              name="volumeLiters"
              inputMode="numeric"
              pattern="[0-9]*"
              autoComplete="off"
              value={form.volumeLiters}
              onChange={handleVolumeChange}
              placeholder="250"
              className="min-w-0 flex-1 border-0 bg-transparent px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none"
            />
            <span className="flex select-none items-center border-l border-[#334155] bg-[#0f172a]/90 px-3 text-sm font-medium text-slate-400">
              litry
            </span>
          </div>
        </div>

        <div>
          <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400">
            Typ akvária
          </span>
          <div className="grid grid-cols-2 gap-2 rounded-xl border border-[#1a2346] bg-[#0a1022] p-1">
            <button
              type="button"
              onClick={() => setForm((p) => ({ ...p, type: "marine" }))}
              className={`rounded-lg py-2.5 text-sm font-semibold transition-colors ${
                form.type === "marine"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-900/30"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Mořské
            </button>
            <button
              type="button"
              onClick={() => setForm((p) => ({ ...p, type: "freshwater" }))}
              className={`rounded-lg py-2.5 text-sm font-semibold transition-colors ${
                form.type === "freshwater"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-900/30"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Sladkovodní
            </button>
          </div>
        </div>

        <Textarea
          label="Poznámka"
          name="note"
          value={form.note}
          onChange={handleChange}
          placeholder="Hlavní displej v obývacím pokoji…"
          rows={4}
        />

        <Input
          label="Číslo zařízení / IP"
          name="deviceAddress"
          value={form.deviceAddress}
          onChange={handleChange}
          placeholder="192.168.1.24"
          required
          rightSlot={<AlertCircle size={18} className="opacity-70" aria-hidden />}/>
      </div>

      <div className="mt-8 flex flex-col gap-3 md:mt-10 md:flex-row md:justify-end md:gap-3">
        <Button
          type="button"
          variant="secondary"
          className="w-full py-3.5 md:w-auto md:min-w-[140px]"
          onClick={onCancel}>
          Zrušit
        </Button>

        <Button type="submit" disabled={!isValid} className="w-full py-3.5 md:w-auto md:min-w-[200px]">
          Přidat a připojit
        </Button>
      </div>
    </form>
  );
};

export default AddAquariumForm;
