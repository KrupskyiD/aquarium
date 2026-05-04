const ProfileUserHero = ({ user }) => {
  return (
    <div className="px-6 py-7 md:py-8 bg-[linear-gradient(180deg,color-mix(in_oklab,var(--auth-input-bg)_90%,black_10%)_0%,color-mix(in_oklab,var(--auth-input-bg)_74%,white_26%)_100%)] text-center border-b border-[var(--auth-input-border)]">
      <div className="w-16 h-16 rounded-full border border-[var(--auth-logo-border)] bg-[var(--auth-logo-bg)] mx-auto flex items-center justify-center text-xl font-bold text-[var(--auth-text-placeholder)] shadow-[0_10px_26px_rgba(37,99,235,0.2)]">
        {user.initials}
      </div>
      <h2 className="mt-4 text-2xl md:text-3xl font-semibold">{user.name}</h2>
      <p className="mt-1 text-sm md:text-base text-[var(--auth-text-muted)]">{user.email}</p>
    </div>
  );
};

export default ProfileUserHero;
