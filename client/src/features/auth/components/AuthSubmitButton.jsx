const AuthSubmitButton = ({
  children,
  loading = false,
  loadingText = 'Loading...',
  disabled = false
}) => {
  return (
    <button
      type="submit"
      disabled={loading || disabled}
      className="w-full mt-2 md:mt-3 bg-[var(--auth-cta-bg)] hover:bg-[var(--auth-cta-bg-hover)] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl py-3.5 md:py-4 text-base md:text-lg transition-all shadow-[0_10px_24px_rgba(54,125,219,0.35)]"
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          {loadingText}
        </span>
      ) : (
        children
      )}
    </button>
  );
};

export default AuthSubmitButton;
