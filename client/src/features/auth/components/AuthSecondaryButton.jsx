const AuthSecondaryButton = ({ children, className = "", ...props }) => {
  return (
    <button
      {...props}
      className={`w-full rounded-xl border border-[var(--auth-input-border)] bg-transparent hover:bg-[var(--auth-input-bg)]/30 disabled:opacity-60 disabled:cursor-not-allowed py-3.5 text-base text-[var(--auth-brand-primary)] font-medium transition ${className}`.trim()}
    >
      {children}
    </button>
  );
};

export default AuthSecondaryButton;
