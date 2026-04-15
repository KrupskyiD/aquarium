const getInputClass = (isValid) => {
  const base =
    'w-full bg-[#0B1120] border rounded-xl px-4 py-3.5 text-sm text-white placeholder-gray-500 outline-none transition-all';

  if (isValid === true) {
    return `${base} border-green-500/40 focus:border-green-500`;
  }

  if (isValid === false) {
    return `${base} border-red-500/40 focus:border-red-500`;
  }

  return `${base} border-gray-800 focus:border-blue-500`;
};

const AuthInput = ({
  label,
  isValid = null,
  className = '',
  wrapperClassName = '',
  ...props
}) => {
  return (
    <div className={wrapperClassName}>
      {label ? (
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
          {label}
        </label>
      ) : null}
      <input className={`${getInputClass(isValid)} ${className}`.trim()} {...props} />
    </div>
  );
};

export default AuthInput;
