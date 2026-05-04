import { ChevronRight } from "lucide-react";

const ListItem = ({ icon, label, suffix, onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full flex items-center gap-3 rounded-xl border border-[var(--auth-input-border)] bg-[var(--auth-input-bg)] px-3.5 py-3 text-left hover:bg-[color-mix(in_oklab,var(--auth-input-bg)_85%,white_15%)] transition-colors"
    >
      {icon ? (
        <span className="w-8 h-8 rounded-lg bg-[color-mix(in_oklab,var(--auth-input-bg)_82%,white_18%)] flex items-center justify-center text-[var(--auth-brand-primary)]">
          {icon}
        </span>
      ) : null}
      <span className="flex-1 text-sm font-medium text-[var(--auth-brand-primary)]">
        {label}
      </span>
      {suffix ? (
        <span className="text-xs text-[var(--auth-text-muted)] mr-1">{suffix}</span>
      ) : null}
      <ChevronRight size={16} className="text-[var(--auth-text-muted)]" />
    </button>
  );
};

export default ListItem;
