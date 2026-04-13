/**
 * Labeled text input for dark dashboard forms.
 */
const Input = ({
  id,
  label,
  name,
  value,
  onChange,
  placeholder,
  required,
  className = "",
  inputClassName = "",
  rightSlot,
  type = "text",
  autoComplete,
}) => {
  const inputId = id ?? name;

  return (
    <div className={className}>
      {label ? (
        <label
          htmlFor={inputId}
          className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400"
        >
          {label}
          {required ? <span className="text-red-400"> *</span> : null}
        </label>
      ) : null}
      <div className="relative flex">
        <input
          id={inputId}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className={`w-full rounded-xl border border-[#1e293b] bg-[#1e293b]/80 px-4 py-3 text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 ${rightSlot ? "pr-11" : ""} ${inputClassName}`.trim()}
        />
        {rightSlot ? (
          <div className="absolute inset-y-0 right-3 flex items-center text-slate-500">
            {rightSlot}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Input;
