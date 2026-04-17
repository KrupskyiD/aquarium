import { ChevronLeft } from "lucide-react";

const TopBar = ({ title, onBack }) => {
  return (
    <header className="px-6 pt-6 pb-5 border-b border-[var(--auth-input-border)] relative text-center">
      {onBack ? (
        <button
          type="button"
          onClick={onBack}
          className="absolute left-6 top-1/2 -translate-y-1/2 text-[var(--auth-text-muted)] hover:text-[var(--auth-brand-primary)] transition-colors"
          aria-label="Zpět"
        >
          <ChevronLeft size={22} />
        </button>
      ) : null}
      <h1 className="text-2xl font-semibold">{title}</h1>
    </header>
  );
};

export default TopBar;
