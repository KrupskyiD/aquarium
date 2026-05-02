import { useMemo, useState } from "react";
import DesktopAppLayout from "../../../shared/components/DesktopAppLayout";
import DeleteConfirmationModal from "../../../shared/components/DeleteConfirmationModal";
import { SCREENS } from "../../../shared/constants/screens";

const EditAquariumPage = ({ aquarium, onNavigate, onSave, onDelete }) => {
  const [name, setName] = useState(aquarium?.name ?? "");
  const [volumeLiters, setVolumeLiters] = useState(
    String(aquarium?.volume ?? ""),
  );
  const [aquariumType, setAquariumType] = useState(aquarium?.type ?? "marine");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isFormValid = useMemo(() => {
    return name.trim().length > 0 && /^\d+$/.test(volumeLiters) && Number(volumeLiters) > 0;
  }, [name, volumeLiters]);

  const handleVolumeChange = (event) => {
    const numericValue = event.target.value.replace(/\D/g, "");
    setVolumeLiters(numericValue);
  };

  const handleSave = () => {
    if (!isFormValid || !aquarium?.id) return;
    onSave?.({
      id: aquarium.id,
      name: name.trim(),
      volume: Number(volumeLiters),
      type: aquariumType,
    });
  };

  const handleDelete = () => {
    setIsModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!aquarium?.id) return;
    onDelete?.(aquarium.id);
    setIsModalOpen(false);
  };

  const content = (
    <div className="mx-auto w-full max-w-[560px] rounded-2xl border border-[#1a2346] bg-[#0f1630] p-5 sm:p-6">
      <header className="mb-6 flex items-center gap-3">
        <button
          type="button"
          onClick={() => onNavigate(SCREENS.DETAIL)}
          aria-label="Zpět"
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#24335f] bg-[#0b152b] text-slate-300 transition-colors hover:text-white"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <h1 className="text-2xl font-bold text-white">Upravit akvárium</h1>
      </header>

      <div className="space-y-5">
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.08em] text-slate-400">
            NÁZEV AKVÁRIA
          </label>
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="w-full rounded-xl border border-[#2f68d6] bg-[#10233f] px-4 py-3 text-lg font-medium text-white outline-none transition focus:border-blue-400"
          />
        </div>

        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.08em] text-slate-400">
            OBJEM (LITRY)
          </label>
          <input
            type="text"
            inputMode="numeric"
            value={volumeLiters}
            onChange={handleVolumeChange}
            className="w-full rounded-xl border border-[#24335f] bg-[#0a1428] px-4 py-3 text-2xl font-semibold text-slate-200 outline-none transition focus:border-blue-500"
          />
        </div>

        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.08em] text-slate-400">
            TYP AKVÁRIA
          </p>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setAquariumType("marine")}
              className={`rounded-xl border px-4 py-3 text-lg font-semibold transition ${
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
              className={`rounded-xl border px-4 py-3 text-lg font-semibold transition ${
                aquariumType === "freshwater"
                  ? "border-blue-500 bg-blue-600 text-white"
                  : "border-[#24335f] bg-[#0a1428] text-slate-300"
              }`}
            >
              Sladkovodní
            </button>
          </div>
        </div>
      </div>

      <div className="mt-8 space-y-3">
        <button
          type="button"
          onClick={handleDelete}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#7b2942] bg-[#3a1522] px-6 py-3 text-lg font-semibold text-[#ff5a78] transition-colors hover:bg-[#4a1a2b]"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path>
            <path d="M10 11v6"></path>
            <path d="M14 11v6"></path>
            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"></path>
          </svg>
          Odebrat akvárium
        </button>

        <button
          type="button"
          onClick={handleSave}
          disabled={!isFormValid}
          className="w-full rounded-xl bg-[#3b82f6] px-6 py-3 text-lg font-semibold text-white transition-colors hover:bg-[#4d8fff] disabled:cursor-not-allowed disabled:opacity-60"
        >
          Uložit změny
        </button>

        <button
          type="button"
          onClick={() => onNavigate(SCREENS.DETAIL)}
          className="w-full rounded-xl border border-[#2a3f73] bg-[#101a33] px-6 py-3 text-lg font-semibold text-slate-200 transition-colors hover:bg-[#162341]"
        >
          Zrušit
        </button>
      </div>

      <DeleteConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );

  return (
    <>
      <section className="min-h-screen bg-[#0B1120] px-5 pb-20 pt-8 text-white md:hidden">
        {content}
      </section>
      <div className="hidden md:block">
        <DesktopAppLayout
          title="Úprava akvária"
          activeScreen={SCREENS.DETAIL}
          onNavigate={onNavigate}
        >
          {content}
        </DesktopAppLayout>
      </div>
    </>
  );
};

export default EditAquariumPage;
