const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-[var(--color-bg-app)] text-white p-4 sm:p-6 lg:p-10 font-sans relative">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-0 left-1/2 w-[520px] h-[520px] bg-[var(--auth-overlay-primary)] rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute top-1/3 left-1/2 w-[340px] h-[340px] bg-[var(--auth-overlay-secondary)] rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      </div>

      <div className="relative z-10 min-h-[calc(100vh-2rem)] lg:min-h-[calc(100vh-5rem)] flex items-center justify-center">
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
