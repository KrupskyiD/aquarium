const AuthCard = ({ children }) => {
  return (
    <div className="w-full max-w-md bg-[var(--color-surface)] border border-[color:var(--color-border)] rounded-3xl p-6 sm:p-7 shadow-lg">
      {children}
    </div>
  );
};

export default AuthCard;
