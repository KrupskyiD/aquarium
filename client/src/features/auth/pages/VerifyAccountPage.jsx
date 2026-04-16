import { useState } from "react";
import AuthCard from "../components/AuthCard";
import AuthFooterLink from "../components/AuthFooterLink";
import AuthLayout from "../components/AuthLayout";
import AuthSecondaryButton from "../components/AuthSecondaryButton";
import AuthStateIcon from "../components/AuthStateIcon";
import AuthTextBlock from "../components/AuthTextBlock";
import { SCREENS } from "../../../shared/constants/screens";

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
        <AuthStateIcon type="verify" />
        <AuthTextBlock title="Ověřte svůj e-mail">
          Odeslali jsme ověřovací odkaz na{" "}
          <span className="text-[var(--auth-link)]">{email || "vas@email.cz"}</span>
        </AuthTextBlock>

        <p className="mt-6 text-center text-sm text-[var(--auth-text-muted)] leading-relaxed max-w-[340px] mx-auto">
          Klikněte na odkaz v e-mailu pro dokončení registrace. Platnost odkazu
          vyprší za 24 hodin.
        </p>

        <AuthSecondaryButton
          type="button"
          onClick={handleResend}
          disabled={resendLoading}
          className="mt-5"
        >
          {resendLoading ? "Odesílám..." : "Odeslat znovu"}
        </AuthSecondaryButton>

        {resendSent ? (
          <p className="text-center text-sm mt-3 text-emerald-400">
            Ověřovací e-mail jsme poslali znovu.
          </p>
        ) : null}

        <div className="mt-6 space-y-3">
          <AuthFooterLink
            text="Špatný e-mail?"
            linkText="Změnit adresu"
            onClick={() => onNavigate?.(SCREENS.REGISTER)}
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
