import { useState } from 'react';
import AuthCard from '../components/AuthCard';
import AuthErrorAlert from '../components/AuthErrorAlert';
import AuthFooterLink from '../components/AuthFooterLink';
import AuthHeader from '../components/AuthHeader';
import AuthInput from '../components/AuthInput';
import AuthLayout from '../components/AuthLayout';
import AuthPasswordInput from '../components/AuthPasswordInput';
import AuthSubmitButton from '../components/AuthSubmitButton';

const LoginPage = ({ onSuccess, onNavigate }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState({ email: false, password: false });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const emailInvalid = email.length > 0 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const passwordInvalid = password.length > 0 && password.length < 8;
  const emailError = touched.email && emailInvalid;
  const passwordError = touched.password && passwordInvalid;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setTouched({ email: true, password: true });
      setError('Vyplň email i heslo.');
      return;
    }

    if (emailInvalid) {
      setError('Zadej platný email.');
      return;
    }

    if (passwordInvalid) {
      setError('Heslo musí mít alespoň 8 znaků.');
      return;
    }

    setLoading(true);
    try {
      // Placeholder flow: auth API napojíme v dalším kroku.
      await new Promise((resolve) => setTimeout(resolve, 350));
      onSuccess?.();
    } catch {
      setError('Přihlášení se nezdařilo. Zkus to prosím znovu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <AuthCard>
        <AuthHeader title="Přihlášení" subtitle="Přihlas se do SaltGuard." />

        <AuthErrorAlert message={error} />

        <form onSubmit={handleSubmit} className="space-y-5">
          <AuthInput
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => setTouched((prev) => ({ ...prev, email: true }))}
            placeholder="name@email.com"
            isValid={touched.email ? !emailInvalid : null}
            required
          />
          {emailError ? (
            <p className="text-xs text-red-400 -mt-3">Email nemá správný formát.</p>
          ) : null}

          <AuthPasswordInput
            label="Heslo"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onBlur={() => setTouched((prev) => ({ ...prev, password: true }))}
            placeholder="Zadej heslo"
            showPassword={showPassword}
            onTogglePassword={() => setShowPassword((prev) => !prev)}
            isValid={touched.password ? !passwordInvalid : null}
          />
          {passwordError ? (
            <p className="text-xs text-red-400 -mt-3">Heslo musí mít minimálně 8 znaků.</p>
          ) : null}

          <AuthSubmitButton loading={loading} loadingText="Přihlašuji...">
            Přihlásit
          </AuthSubmitButton>
        </form>

        <AuthFooterLink
          text="Nemáš účet?"
          linkText="Registrace"
          onClick={() => onNavigate?.('register')}
        />
      </AuthCard>
    </AuthLayout>
  );
};

export default LoginPage;
