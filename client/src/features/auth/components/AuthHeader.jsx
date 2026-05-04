const Logo = () => (
  <div className="flex flex-col items-center justify-center">
    <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl border border-[var(--auth-logo-border)] bg-[var(--auth-logo-bg)] flex items-center justify-center shadow-[0_10px_26px_rgba(37,99,235,0.22)]">
      <svg className="w-5 h-5 text-[var(--auth-brand-accent)]" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2C12 2 5 10.5 5 15a7 7 0 0014 0C19 10.5 12 2 12 2z" />
      </svg>
    </div>
    <span className="mt-3 text-[34px] md:text-[38px] leading-none font-bold tracking-tight">
      <span className="text-[var(--auth-brand-primary)]">Salt</span>
      <span className="text-[var(--auth-brand-accent)]">Guard</span>
    </span>
  </div>
);

const AuthHeader = ({ title, subtitle }) => {
  return (
    <header className="mb-7 md:mb-8">
      <Logo />
      <h1 className="text-lg md:text-xl font-semibold text-center mt-4">{title}</h1>
      {subtitle ? (
        <p className="text-[var(--auth-text-muted)] text-sm md:text-base text-center mt-2 max-w-[300px] mx-auto leading-snug">
          {subtitle}
        </p>
      ) : null}
    </header>
  );
};

export default AuthHeader;
