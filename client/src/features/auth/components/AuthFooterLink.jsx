const AuthFooterLink = ({ text, linkText, to, onClick }) => {
  const isButton = typeof onClick === 'function' || !to || to === '#';

  return (
    <p className="text-gray-500 text-sm mt-7 text-center">
      {text}{' '}
      {isButton ? (
        <button
          type="button"
          onClick={onClick}
          className="text-blue-500 hover:text-blue-400 font-medium transition"
        >
          {linkText}
        </button>
      ) : (
        <a href={to} className="text-blue-500 hover:text-blue-400 font-medium transition">
          {linkText}
        </a>
      )}
    </p>
  );
};

export default AuthFooterLink;
