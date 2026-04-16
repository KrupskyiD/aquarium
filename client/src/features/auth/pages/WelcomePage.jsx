import AuthCard from "../components/AuthCard";
import AuthLayout from "../components/AuthLayout";
import AuthStateIcon from "../components/AuthStateIcon";
import AuthTextBlock from "../components/AuthTextBlock";

const WelcomePage = ({ name, onContinue }) => {
  return (
    <AuthLayout>
      <AuthCard>
        <div className="text-center">
          <AuthStateIcon type="success" />
          <AuthTextBlock title={`Vítejte${name ? `, ${name}` : ""}!`}>
            Váš účet byl úspěšně vytvořen. Akvárium je připraveno ke sledování.
          </AuthTextBlock>

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
