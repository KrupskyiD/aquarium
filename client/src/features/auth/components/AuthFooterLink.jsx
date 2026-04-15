const AuthFooterLink = ({ text, linkText, to, onClick }) => {
  const isButton = typeof onClick === 'function' || !to || to === '#';

  return (
    <p className="text-[color:var(--color-text-muted)] text-sm mt-7 text-center">
      {text}{' '}
      {isButton ? (
        <button
          type="button"
          onClick={onClick}
          className="text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] font-medium transition"
        >
          {linkText}
        </button>
      ) : (
        <a
          href={to}
          className="text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] font-medium transition"
        >
          {linkText}
        </a>
      )}
    </p>
  );
};

export default AuthFooterLink;
