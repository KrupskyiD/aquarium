import AuthCard from "../components/AuthCard";
import AuthLayout from "../components/AuthLayout";

const SuccessIcon = () => (
  <div className="mx-auto w-24 h-24 rounded-full border border-emerald-400/35 bg-emerald-500/15 flex items-center justify-center shadow-[0_10px_26px_rgba(16,185,129,0.22)]">
    <svg className="w-10 h-10 text-emerald-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.4} d="M5 13l4 4L19 7" />
    </svg>
  </div>
);

const WelcomePage = ({ name, onContinue }) => {
  return (
    <AuthLayout>
      <AuthCard>
        <div className="text-center">
          <SuccessIcon />
          <h1 className="text-3xl font-semibold mt-6">
            Vítejte{name ? `, ${name}` : ""}!
          </h1>
          <p className="text-[var(--auth-text-muted)] text-sm md:text-base mt-3 max-w-[320px] mx-auto leading-snug">
            Váš účet byl úspěšně vytvořen. Akvárium je připraveno ke sledování.
          </p>

          <button
            type="button"
            onClick={onContinue}
            className="mt-8 w-full bg-[var(--auth-cta-bg)] hover:bg-[var(--auth-cta-bg-hover)] active:scale-[0.99] text-white font-semibold rounded-xl py-3.5 md:py-4 text-base md:text-lg transition-all shadow-[0_10px_24px_rgba(54,125,219,0.35)]"
          >
            Přejít na přehled
          </button>
        </div>
      </AuthCard>
    </AuthLayout>
  );
};

export default WelcomePage;
