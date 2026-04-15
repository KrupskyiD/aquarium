import AuthInput from './AuthInput';

const EyeIcon = ({ open }) => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    {open ? (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
      />
    ) : (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
      />
    )}
  </svg>
);

const AuthPasswordInput = ({
  label,
  value,
  onChange,
  placeholder = '••••••••',
  showPassword,
  onTogglePassword,
  isValid = null,
  onBlur,
  requiredMark = false,
  showPasswordToggle = true,
  showStatusIcon = false
}) => {
  const shouldShowStatus = showStatusIcon && isValid !== null;

  return (
    <div>
      {label ? (
        <label className="block text-sm md:text-[15px] font-medium text-[var(--auth-text-muted)] tracking-wide mb-2">
          {label}
          {requiredMark ? <span className="text-rose-400"> *</span> : null}
        </label>
      ) : null}
      <div className="relative">
        <AuthInput
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          isValid={isValid}
          className={showPasswordToggle || shouldShowStatus ? 'pr-11' : ''}
          required
        />
        {showPasswordToggle && !shouldShowStatus ? (
          <button
            type="button"
            onClick={onTogglePassword}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--auth-text-placeholder)] hover:text-slate-300 transition"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            <EyeIcon open={showPassword} />
          </button>
        ) : null}
        {!showPasswordToggle && shouldShowStatus ? (
          <span
            className={`absolute right-3.5 top-1/2 -translate-y-1/2 text-xl leading-none ${
              isValid ? 'text-emerald-400' : 'text-rose-400'
            }`}
          >
            {isValid ? '✓' : '✕'}
          </span>
        ) : null}
      </div>
    </div>
  );
};

export default AuthPasswordInput;
