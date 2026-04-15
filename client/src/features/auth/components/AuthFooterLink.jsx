const AuthFooterLink = ({ text, linkText, to, onClick }) => {
  const isButton = typeof onClick === 'function' || !to || to === '#';

  return (
    <p className="text-[var(--auth-text-muted)] text-sm md:text-base mt-6 md:mt-7 text-center">
      {text}{' '}
      {isButton ? (
        <button
          type="button"
          onClick={onClick}
          className="text-[var(--auth-link)] hover:text-blue-300 font-semibold transition"
        >
          {linkText}
        </button>
      ) : (
        <a
          href={to}
          className="text-[var(--auth-link)] hover:text-blue-300 font-semibold transition"
        >
          {linkText}
        </a>
      )}
    </p>
  );
};

export default AuthFooterLink;
