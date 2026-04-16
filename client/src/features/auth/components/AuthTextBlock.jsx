const AuthTextBlock = ({ title, children, subtitleClassName = "" }) => {
  return (
    <div className="text-center">
      <h1 className="text-2xl md:text-3xl font-semibold mt-6">{title}</h1>
      <p
        className={`text-[var(--auth-text-muted)] text-sm md:text-base mt-3 max-w-[340px] mx-auto leading-snug ${subtitleClassName}`.trim()}
      >
        {children}
      </p>
    </div>
  );
};

export default AuthTextBlock;
