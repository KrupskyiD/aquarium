const MetricTile = ({ label, value, unit }) => {
  return (
    <div className="bg-[color-mix(in_oklab,var(--auth-input-bg)_80%,white_20%)] p-4 rounded-2xl border border-[var(--auth-input-border)] flex flex-col items-center">
      <p className="text-[10px] font-bold text-[var(--auth-text-muted)] mb-2 uppercase tracking-widest text-center">
        {label}
      </p>
      <div className="flex items-baseline text-white">
        <span className="text-2xl font-bold">{value}</span>
        <span className="text-xs text-[var(--auth-text-muted)] ml-1 font-medium">{unit}</span>
      </div>
    </div>
  );
};

export default MetricTile;
