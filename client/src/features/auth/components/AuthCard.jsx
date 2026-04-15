const AuthCard = ({ children }) => {
  return (
    <div className="w-full max-w-[390px] md:max-w-[520px] bg-[image:var(--auth-card-gradient)] border border-[var(--auth-card-border)] rounded-[26px] md:rounded-[30px] p-6 md:p-8 shadow-[0_20px_54px_rgba(2,6,23,0.68)]">
      <div className="mx-auto max-w-[390px]">{children}</div>
    </div>
  );
};

export default AuthCard;
