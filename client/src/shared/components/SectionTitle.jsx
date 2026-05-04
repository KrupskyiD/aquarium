const SectionTitle = ({ children }) => {
  return (
    <p className="text-[11px] uppercase tracking-[0.16em] text-[var(--auth-text-muted)] font-semibold mb-2">
      {children}
    </p>
  );
};

export default SectionTitle;
