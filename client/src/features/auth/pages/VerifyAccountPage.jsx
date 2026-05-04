import { useState } from "react";
import AuthCard from "../components/AuthCard";
import AuthFooterLink from "../components/AuthFooterLink";
import AuthLayout from "../components/AuthLayout";
import AuthSecondaryButton from "../components/AuthSecondaryButton";
import AuthStateIcon from "../components/AuthStateIcon";
import AuthTextBlock from "../components/AuthTextBlock";
import { SCREENS } from "../../../shared/constants/screens";
import { resendVerificationEmail, verifyEmailToken } from "../api/authApi";

const VerifyAccountPage = ({
  email,
  verificationToken,
  onTokenUpdate,
  onNavigate,
  onSuccess,
}) => {
  const [resendLoading, setResendLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [resendSent, setResendSent] = useState(false);
  const [error, setError] = useState("");

  const tokenFromQuery = new URLSearchParams(window.location.search).get("token");
  const effectiveToken = tokenFromQuery || verificationToken;

  const handleResend = async () => {
    if (resendLoading) return;
    setResendLoading(true);
    setResendSent(false);
    setError("");
    try {
      const response = await resendVerificationEmail(email);
      if (response?.data?.verificationToken) {
        onTokenUpdate?.(response.data.verificationToken);
      }
      setResendSent(true);
    } catch (requestError) {
      setError(requestError.message || "Nepodařilo se odeslat ověřovací email znovu.");
    } finally {
      setResendLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!effectiveToken) {
      setError("Otevřete ověřovací odkaz z emailu, nebo si nechte poslat nový.");
      return;
    }

    setVerifyLoading(true);
    setError("");
    try {
      await verifyEmailToken(effectiveToken);
      onSuccess?.();
    } catch (requestError) {
      setError(requestError.message || "Ověření účtu se nezdařilo.");
    } finally {
      setVerifyLoading(false);
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
        {error ? (
          <p className="text-center text-sm mt-3 text-rose-400">{error}</p>
        ) : null}

        <div className="mt-6 space-y-3">
          <AuthFooterLink
            text="Špatný e-mail?"
            linkText="Změnit adresu"
            onClick={() => onNavigate?.(SCREENS.REGISTER)}
          />
          <button
            type="button"
            onClick={handleVerify}
            disabled={verifyLoading}
            className="block w-full text-center text-sm text-[var(--auth-link)] hover:text-blue-300 font-semibold transition"
          >
            {verifyLoading ? "Ověřuji..." : "Dokončit ověření"}
          </button>
        </div>
      </AuthCard>
    </AuthLayout>
  );
};

export default VerifyAccountPage;
