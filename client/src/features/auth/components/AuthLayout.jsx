const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-[var(--color-bg-app)] text-white p-5 font-sans relative">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-0 left-0 w-[360px] h-[360px] bg-blue-600/10 rounded-full blur-3xl -translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-blue-900/10 rounded-full blur-3xl translate-x-1/4 translate-y-1/4" />
      </div>

      <div className="relative z-10 min-h-[calc(100vh-2.5rem)] flex items-center justify-center">
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
