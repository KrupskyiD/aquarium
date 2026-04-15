const getInputClass = (isValid) => {
  const base =
    'w-full bg-[var(--color-bg-app)] border rounded-xl px-4 py-3.5 text-sm text-white placeholder:text-[color:var(--color-text-subtle)] outline-none transition-all';

  if (isValid === true) {
    return `${base} border-[color:color-mix(in_oklab,var(--color-success)_40%,transparent)] focus:border-[var(--color-success)]`;
  }

  if (isValid === false) {
    return `${base} border-[color:color-mix(in_oklab,var(--color-danger)_40%,transparent)] focus:border-[var(--color-danger)]`;
  }

  return `${base} border-[color:var(--color-border)] focus:border-[var(--color-primary)]`;
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
        <label className="block text-xs font-bold text-[color:var(--color-text-subtle)] uppercase tracking-wider mb-2">
          {label}
          {requiredMark ? <span className="text-[var(--color-danger)]"> *</span> : null}
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
              isValid ? 'text-[var(--color-success)]' : 'text-[var(--color-danger)]'
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
