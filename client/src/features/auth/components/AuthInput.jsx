const getInputClass = (isValid) => {
  const base =
    'w-full bg-[var(--auth-input-bg)] border rounded-xl px-4 py-3 md:py-3.5 text-base text-slate-200 placeholder:text-[var(--auth-text-placeholder)] outline-none transition-colors';

  if (isValid === true) {
    return `${base} border-emerald-500/45 focus:border-emerald-400`;
  }

  if (isValid === false) {
    return `${base} border-rose-500/55 focus:border-rose-400`;
  }

  return `${base} border-[var(--auth-input-border)] focus:border-[var(--auth-brand-accent)]`;
};

const CheckIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
  </svg>
);

const XIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const AuthInput = ({
  label,
  isValid = null,
  showStatusIcon = false,
  requiredMark = false,
  className = '',
  wrapperClassName = '',
  ...props
}) => {
  return (
    <div className={wrapperClassName}>
      {label ? (
        <label className="block text-sm md:text-[15px] font-medium text-[var(--auth-text-muted)] tracking-wide mb-2">
          {label}
          {requiredMark ? <span className="text-rose-400"> *</span> : null}
        </label>
      ) : null}
      <div className="relative">
        <input
          className={`${getInputClass(isValid)} ${showStatusIcon ? 'pr-11' : ''} ${className}`.trim()}
          {...props}
        />
        {showStatusIcon && isValid !== null ? (
          <span
            className={`absolute right-3.5 top-1/2 -translate-y-1/2 ${
              isValid ? 'text-emerald-400' : 'text-rose-400'
            }`}
          >
            {isValid ? <CheckIcon /> : <XIcon />}
          </span>
        ) : null}
      </div>
    </div>
  );
};

export default AuthInput;
