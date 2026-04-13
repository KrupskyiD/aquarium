/**
 * Reusable button with SaltGuard dashboard variants.
 */
const base =
  "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#090d1a] disabled:pointer-events-none disabled:opacity-45";

const variants = {
  primary:
    "bg-blue-600 text-white shadow-lg shadow-blue-900/30 hover:bg-blue-500 active:scale-[0.98]",
  secondary:
    "border border-slate-600 bg-transparent text-slate-100 hover:bg-slate-800/80 active:scale-[0.98]",
  ghost: "bg-transparent text-slate-300 hover:bg-slate-800/60",
  icon: "rounded-lg bg-blue-600 p-2.5 text-white shadow-md shadow-blue-900/40 hover:bg-blue-500 active:scale-95",
};

const Button = ({
  variant = "primary",
  className = "",
  type = "button",
  children,
  ...rest
}) => (
  <button
    type={type}
    className={`${base} ${variants[variant] ?? variants.primary} ${className}`.trim()}
    {...rest}
  >
    {children}
  </button>
);

export default Button;
