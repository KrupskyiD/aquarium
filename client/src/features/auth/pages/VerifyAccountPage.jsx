import { useState } from "react";
import AuthCard from "../components/AuthCard";
import AuthFooterLink from "../components/AuthFooterLink";
import AuthLayout from "../components/AuthLayout";

const VerifyIcon = () => (
  <div className="mx-auto w-20 h-20 rounded-full border border-[var(--auth-logo-border)] bg-[var(--auth-logo-bg)] flex items-center justify-center shadow-[0_10px_26px_rgba(37,99,235,0.22)]">
    <svg
      className="w-9 h-9 text-[var(--auth-brand-primary)]"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.8}
        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8m-16 9h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
      />
    </svg>
  </div>
);

const VerifyAccountPage = ({ email, onNavigate, onSuccess }) => {
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSent, setResendSent] = useState(false);

  const handleResend = async () => {
    if (resendLoading) return;
    setResendLoading(true);
    setResendSent(false);
    try {
      // Placeholder flow: resend API napojime v dalsim kroku.
      await new Promise((resolve) => setTimeout(resolve, 550));
      setResendSent(true);
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <AuthLayout>
      <AuthCard>
        <div className="text-center">
          <VerifyIcon />
          <h1 className="text-2xl font-semibold mt-6">Ověřte svůj e-mail</h1>
          <p className="text-[var(--auth-text-muted)] text-sm md:text-base mt-3 max-w-[310px] mx-auto leading-snug">
            Odeslali jsme ověřovací odkaz na{" "}
            <span className="text-[var(--auth-link)]">
              {email || "vas@email.cz"}
            </span>
          </p>
        </div>

        <p className="mt-6 text-center text-sm text-[var(--auth-text-muted)] leading-relaxed max-w-[340px] mx-auto">
          Klikněte na odkaz v e-mailu pro dokončení registrace. Platnost odkazu
          vyprší za 24 hodin.
        </p>

        <button
          type="button"
          onClick={handleResend}
          disabled={resendLoading}
          className="mt-5 w-full rounded-xl border border-[var(--auth-input-border)] bg-transparent hover:bg-[var(--auth-input-bg)]/30 disabled:opacity-60 disabled:cursor-not-allowed py-3.5 text-base text-[var(--auth-brand-primary)] font-medium transition"
        >
          {resendLoading ? "Odesílám..." : "Odeslat znovu"}
        </button>

        {resendSent ? (
          <p className="text-center text-sm mt-3 text-emerald-400">
            Ověřovací e-mail jsme poslali znovu.
          </p>
        ) : null}

        <div className="mt-6 space-y-3">
          <AuthFooterLink
            text="Špatný e-mail?"
            linkText="Změnit adresu"
            onClick={() => onNavigate?.("register")}
          />
          <button
            type="button"
            onClick={onSuccess}
            className="block w-full text-center text-sm text-[var(--auth-link)] hover:text-blue-300 font-semibold transition"
          >
            Už jsem e-mail ověřil(a)
          </button>
        </div>
      </AuthCard>
    </AuthLayout>
  );
};

export default VerifyAccountPage;
