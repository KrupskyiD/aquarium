import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import DesktopAppLayout from "../../../shared/components/DesktopAppLayout";
import { fetchMeAuth, updateProfileAuth } from "../../auth/api/authApi";

const EditProfilePage = ({ accessToken, authUser, onProfileUpdated }) => {
  const navigate = useNavigate();
  const [name, setName] = useState(authUser?.name ?? "");
  const [email, setEmail] = useState(authUser?.email ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const loadMe = async () => {
      if (!accessToken) return;
      try {
        const response = await fetchMeAuth(accessToken);
        const me = response?.data?.user;
        if (me) {
          setName(me.name ?? "");
          setEmail(me.email ?? "");
        }
      } catch {
        // Keep local values when loading profile fails.
      }
    };

    loadMe();
  }, [accessToken]);

  const isValid = useMemo(() => {
    const normalizedName = name.trim();
    const normalizedEmail = email.trim();
    return normalizedName.length > 0 && normalizedEmail.length > 0;
  }, [name, email]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!isValid || !accessToken || loading) return;

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await updateProfileAuth(accessToken, {
        name: name.trim(),
        email: email.trim(),
      });
      const updatedUser = response?.data?.user;
      if (updatedUser) {
        onProfileUpdated?.(updatedUser);
      }
      setSuccess("Profil byl úspěšně aktualizován.");
    } catch (err) {
      setError(err?.message || "Nepodařilo se uložit změny profilu.");
    } finally {
      setLoading(false);
    }
  };

  const content = (
    <div className="mx-auto w-full max-w-[560px] rounded-2xl border border-[#1a2346] bg-[#0f1630] p-5 sm:p-6">
      <header className="mb-6 flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate("/profile")}
          aria-label="Zpět"
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#24335f] bg-[#0b152b] text-slate-300 transition-colors hover:text-white"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <h1 className="text-2xl font-bold text-white">Upravit profil</h1>
      </header>

      <form className="space-y-5" onSubmit={handleSubmit}>
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.08em] text-slate-400">
            JMÉNO
          </label>
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="w-full rounded-xl border border-[#2f68d6] bg-[#10233f] px-4 py-3 text-lg font-medium text-white outline-none transition focus:border-blue-400"
          />
        </div>

        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.08em] text-slate-400">
            E-MAIL
          </label>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-xl border border-[#24335f] bg-[#0a1428] px-4 py-3 text-lg font-medium text-slate-200 outline-none transition focus:border-blue-500"
          />
        </div>

        {error ? (
          <p className="rounded-xl border border-[#7b2942] bg-[#3a1522] px-4 py-3 text-sm text-[#ff9db1]">
            {error}
          </p>
        ) : null}
        {success ? (
          <p className="rounded-xl border border-[#205a3f] bg-[#113226] px-4 py-3 text-sm text-[#8ef0c2]">
            {success}
          </p>
        ) : null}

        <div className="space-y-3 pt-2">
          <button
            type="submit"
            disabled={!isValid || loading}
            className="w-full rounded-xl bg-[#3b82f6] px-6 py-3 text-lg font-semibold text-white transition-colors hover:bg-[#4d8fff] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Ukládám..." : "Uložit změny"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/profile")}
            className="w-full rounded-xl border border-[#2a3f73] bg-[#101a33] px-6 py-3 text-lg font-semibold text-slate-200 transition-colors hover:bg-[#162341]"
          >
            Zrušit
          </button>
        </div>
      </form>
    </div>
  );

  return (
    <>
      <section className="min-h-screen bg-[#0B1120] px-5 pb-20 pt-8 text-white md:hidden">
        {content}
      </section>
      <div className="hidden md:block">
        <DesktopAppLayout title="Úprava profilu">
          {content}
        </DesktopAppLayout>
      </div>
    </>
  );
};

export default EditProfilePage;
