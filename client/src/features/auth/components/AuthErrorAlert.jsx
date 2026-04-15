const AuthErrorAlert = ({ message }) => {
  if (!message) return null;

  return (
    <div className="bg-[color-mix(in_oklab,var(--color-danger)_14%,transparent)] border border-[color-mix(in_oklab,var(--color-danger)_30%,transparent)] text-[var(--color-danger)] text-xs rounded-xl px-4 py-3 mb-6 flex items-center gap-2.5">
      <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 9v2m0 4h.01M12 3a9 9 0 100 18A9 9 0 0012 3z"
        />
      </svg>
      {message}
    </div>
  );
};

export default AuthErrorAlert;
