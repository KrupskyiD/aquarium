/**
 * Labeled textarea for notes and descriptions.
 */
const Textarea = ({
  id,
  label,
  name,
  value,
  onChange,
  placeholder,
  rows = 4,
  className = "",
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
        </label>
      ) : null}
      <textarea
        id={inputId}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        className="w-full resize-y rounded-xl border border-[#1e293b] bg-[#1e293b]/80 px-4 py-3 text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
      />
    </div>
  );
};

export default Textarea;
