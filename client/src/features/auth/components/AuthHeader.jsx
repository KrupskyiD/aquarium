const Logo = () => (
  <div className="flex items-center gap-2.5 justify-center">
    <svg className="w-6 h-6 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2C12 2 5 10.5 5 15a7 7 0 0014 0C19 10.5 12 2 12 2z" />
    </svg>
    <span className="text-base font-bold text-white tracking-wide">SaltGuard</span>
  </div>
);

const AuthHeader = ({ title, subtitle }) => {
  return (
    <header className="mb-7">
      <Logo />
      <h1 className="text-xl font-bold text-center mt-4">{title}</h1>
      {subtitle ? <p className="text-gray-400 text-sm text-center mt-1">{subtitle}</p> : null}
    </header>
  );
};

export default AuthHeader;
