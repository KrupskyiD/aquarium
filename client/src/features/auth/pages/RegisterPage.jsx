import { useMemo, useState } from "react";
import AuthCard from "../components/AuthCard";
import AuthErrorAlert from "../components/AuthErrorAlert";
import AuthFooterLink from "../components/AuthFooterLink";
import AuthHeader from "../components/AuthHeader";
import AuthInput from "../components/AuthInput";
import AuthLayout from "../components/AuthLayout";
import AuthPasswordInput from "../components/AuthPasswordInput";
import AuthSubmitButton from "../components/AuthSubmitButton";
import { SCREENS } from "../../../shared/constants/screens";
import { registerAuth } from "../api/authApi";

const getStrength = (password) => {
  if (!password)
    return { score: 0, label: "", color: "bg-white/10 text-gray-500" };

  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1)
    return { score, label: "Slabé", color: "bg-red-500 text-red-400" };
  if (score === 2)
    return { score, label: "Průměrné", color: "bg-orange-500 text-orange-400" };
  if (score === 3)
    return { score, label: "Dobré", color: "bg-yellow-500 text-yellow-400" };
  return { score, label: "Silné", color: "bg-green-500 text-green-400" };
};

const RegisterPage = ({ onSuccess, onNavigate }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    password: false,
    confirmPassword: false,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const emailValid = useMemo(() => {
    if (!email) return null;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }, [email]);

  const nameValid = useMemo(() => {
    if (!name) return null;
    return name.trim().length >= 2;
  }, [name]);

  const passwordsMatch = useMemo(() => {
    if (!confirmPassword) return null;
    return password === confirmPassword;
  }, [password, confirmPassword]);

  const strength = useMemo(() => getStrength(password), [password]);
  const canSubmit =
    nameValid === true &&
    emailValid === true &&
    password.length >= 8 &&
    passwordsMatch === true &&
    termsAccepted === true;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name.trim() || !email || !password || !confirmPassword) {
      setTouched({
        name: true,
        email: true,
        password: true,
        confirmPassword: true,
      });
      setError("Vyplň všechna pole.");
      return;
    }
    if (!termsAccepted) {
      setError("Musíš souhlasit s podmínkami použití.");
      return;
    }
    if (emailValid === false) {
      setError("Neplatný email.");
      return;
    }
    if (password.length < 8) {
      setError("Heslo musí mít alespoň 8 znaků.");
      return;
    }
    if (!passwordsMatch) {
      setError("Hesla se neshodují.");
      return;
    }

    setLoading(true);
    try {
      const response = await registerAuth({
        name: name.trim(),
        email: email.trim(),
        password,
      });

      onSuccess?.({
        email: response?.data?.email || email.trim(),
        name: response?.data?.name || name.trim(),
        verificationToken: response?.data?.verificationToken || "",
      });
    } catch (requestError) {
      if (requestError.status === 400) {
        setError(requestError.message || "Registrace se nezdařila.");
      } else {
        setError("Registrace se nezdařila. Zkus to prosím znovu.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <AuthCard>
        <AuthHeader
          title="Vytvořit účet"
          subtitle="Vytvořte si účet a mějte akvárium pod kontrolou v reálném čase"
        />

        <AuthErrorAlert message={error} />

        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
          <AuthInput
            label="Jméno"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={() => setTouched((prev) => ({ ...prev, name: true }))}
            placeholder="Jan Novák"
            isValid={touched.name ? nameValid : null}
            showStatusIcon={touched.name}
            requiredMark
            required
          />
          {touched.name && nameValid === false ? (
            <p className="text-xs text-rose-400 -mt-2">
              Jméno musí mít alespoň 2 znaky.
            </p>
          ) : null}

          <AuthInput
            label="E-mail"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => setTouched((prev) => ({ ...prev, email: true }))}
            placeholder="jan.novak@email.cz"
            isValid={touched.email ? emailValid : null}
            showStatusIcon={touched.email}
            requiredMark
            required
          />
          {touched.email && emailValid === false ? (
            <p className="text-xs text-rose-400 -mt-2">
              Email nemá správný formát.
            </p>
          ) : null}

          <div>
            <AuthPasswordInput
              label="Heslo"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={() => setTouched((prev) => ({ ...prev, password: true }))}
              placeholder="••••••••"
              showPassword={showPassword}
              onTogglePassword={() => setShowPassword((prev) => !prev)}
              isValid={touched.password ? password.length >= 8 : null}
              requiredMark
            />
            {touched.password && password.length > 0 && password.length < 8 ? (
              <p className="text-xs text-rose-400 mt-1.5">
                Heslo musí mít minimálně 8 znaků.
              </p>
            ) : null}
            {password ? (
              <div className="mt-2.5">
                <div className="flex gap-1.5 mb-1.5">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className={`h-0.5 flex-1 rounded-full ${
                        i <= strength.score
                          ? strength.color.split(" ")[0]
                          : "bg-white/15"
                      }`}
                    />
                  ))}
                </div>
                <p className={`text-[11px] ${strength.color.split(" ")[1]}`}>
                  {strength.label}
                </p>
              </div>
            ) : null}
          </div>

          <AuthPasswordInput
            label="Potvrď heslo"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            onBlur={() =>
              setTouched((prev) => ({ ...prev, confirmPassword: true }))
            }
            placeholder="••••••••"
            showPassword={showConfirmPassword}
            onTogglePassword={() => setShowConfirmPassword((prev) => !prev)}
            isValid={touched.confirmPassword ? passwordsMatch : null}
            requiredMark
            showPasswordToggle
            showStatusIcon={touched.confirmPassword}
          />
          {touched.confirmPassword && passwordsMatch === false ? (
            <p className="text-xs text-rose-400 -mt-2">Hesla se neshodují.</p>
          ) : null}

          <div className="pt-1">
            <label className="inline-flex items-start gap-2 text-[11px] text-slate-500 leading-relaxed cursor-pointer select-none">
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="mt-0.5 w-3.5 h-3.5 rounded border-slate-700 bg-[#0B1120] text-blue-500 focus:ring-blue-500/40"
              />
              <span>
                Souhlasím s{" "}
                <button
                  type="button"
                  className="text-blue-400 hover:text-blue-300 transition underline underline-offset-2"
                >
                  podmínkami použití
                </button>
              </span>
            </label>
          </div>

          <AuthSubmitButton
            loading={loading}
            loadingText="Vytvářím účet..."
            disabled={!canSubmit}
          >
            Vytvořit účet
          </AuthSubmitButton>
        </form>

        <AuthFooterLink
          text="Už máte účet?"
          linkText="Přihlásit se"
          onClick={() => onNavigate?.(SCREENS.LOGIN)}
        />
      </AuthCard>
    </AuthLayout>
  );
};

export default RegisterPage;
