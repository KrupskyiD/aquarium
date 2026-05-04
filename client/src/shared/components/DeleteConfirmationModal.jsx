const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm }) => {
  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-200 ${
        isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
      }`}
      aria-hidden={!isOpen}
    >
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-200"
        onClick={onClose}
      />

      <div className="relative w-full max-w-md rounded-2xl border border-gray-800 bg-[#161b22] p-6 text-white shadow-2xl">
        <h2 className="text-xl font-bold">Smazat akvárium</h2>
        <p className="mt-3 text-sm leading-relaxed text-slate-300">
          Opravdu si přejete smazat toto akvárium? Tato akce je nevratná.
        </p>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-600 bg-transparent px-4 py-2.5 font-semibold text-slate-200 transition-colors hover:bg-slate-800/40"
          >
            Zrušit
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-xl bg-red-600 px-4 py-2.5 font-semibold text-white transition-colors hover:bg-red-500"
          >
            Smazat
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
