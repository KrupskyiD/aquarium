/**
 * Status or label pill for cards and headers.
 */
const variants = {
  online: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/25",
  offline: "bg-slate-700/50 text-slate-400 border border-slate-600/50",
  warning: "bg-amber-500/15 text-amber-400 border border-amber-500/25",
  neutral: "bg-slate-700/40 text-slate-300 border border-slate-600/40",
};

const Badge = ({ children, variant = "neutral", className = "" }) => (
  <span
    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${variants[variant] ?? variants.neutral} ${className}`.trim()}
  >
    {children}
  </span>
);

export default Badge;
