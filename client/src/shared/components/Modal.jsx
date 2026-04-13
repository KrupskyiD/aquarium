import { useEffect } from "react";

/**
 * Modal overlay: full-screen on small viewports, centered card on md+.
 */
const Modal = ({ open, onClose, title, children, footer }) => {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-black/70 p-0 backdrop-blur-sm md:items-center md:p-6"
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
    >
      <div
        className="flex max-h-[100dvh] w-full max-w-lg flex-col rounded-t-2xl border border-[#1e293b] bg-[#111827] shadow-2xl md:max-h-[min(90dvh,900px)] md:rounded-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "modal-title" : undefined}
      >
        {title ? (
          <div className="border-b border-[#1e293b] px-5 py-4 md:px-8 md:pt-8">
            <h2 id="modal-title" className="text-center text-lg font-bold text-white md:text-left">
              {title}
            </h2>
          </div>
        ) : null}
        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 md:px-8 md:pb-6">{children}</div>
        {footer ? (
          <div className="border-t border-[#1e293b] px-5 py-4 md:px-8 md:pb-8">{footer}</div>
        ) : null}
      </div>
    </div>
  );
};

export default Modal;
