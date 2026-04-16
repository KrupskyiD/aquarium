const PrimaryCard = ({ children, className = "", contentClassName = "" }) => {
  return (
    <section
      className={`w-full max-w-[430px] md:max-w-[720px] bg-[image:var(--auth-card-gradient)] border border-[var(--auth-card-border)] rounded-[26px] md:rounded-[30px] shadow-[0_20px_54px_rgba(2,6,23,0.68)] overflow-hidden ${className}`.trim()}
    >
      <div className={`mx-auto ${contentClassName}`.trim()}>{children}</div>
    </section>
  );
};

export default PrimaryCard;
