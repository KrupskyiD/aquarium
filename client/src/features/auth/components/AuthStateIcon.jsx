const iconStyles = {
  verify:
    "mx-auto w-20 h-20 rounded-full border border-[var(--auth-logo-border)] bg-[var(--auth-logo-bg)] text-[var(--auth-brand-primary)] shadow-[0_10px_26px_rgba(37,99,235,0.22)]",
  success:
    "mx-auto w-24 h-24 rounded-full border border-emerald-400/35 bg-emerald-500/15 text-emerald-300 shadow-[0_10px_26px_rgba(16,185,129,0.22)]",
};

const AuthStateIcon = ({ type = "verify" }) => {
  return (
    <div className={`${iconStyles[type] || iconStyles.verify} flex items-center justify-center`}>
      {type === "success" ? (
        <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.4} d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <svg className="w-9 h-9" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.8}
            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8m-16 9h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
          />
        </svg>
      )}
    </div>
  );
};

export default AuthStateIcon;
