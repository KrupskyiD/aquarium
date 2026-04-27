import { useState, useEffect } from "react";
import "./App.css";
import LoginPage from "./features/auth/pages/LoginPage";
import RegisterPage from "./features/auth/pages/RegisterPage";
import VerifyAccountPage from "./features/auth/pages/VerifyAccountPage";
import MainDetail from "./features/detail/pages/MainDetail";
import WelcomePage from "./features/auth/pages/WelcomePage";
import ProfilePage from "./features/user/pages/ProfilePage";
import OverviewPage from "./features/overview/pages/OverviewPage";
import UserBottomNav from "./shared/components/UserBottomNav";
import { SCREENS } from "./shared/constants/screens";

const AUTH_SESSION_STORAGE_KEY = "saltguard.auth.session";

const parseStoredSession = () => {
  try {
    const raw = localStorage.getItem(AUTH_SESSION_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

function App() {
  const [authSession, setAuthSession] = useState(() => parseStoredSession());
  //for showing only a Detail screen
  //const [currentScreen, setCurrentScreen] = useState(SCREENS.DETAIL);
  const [currentScreen, setCurrentScreen] = useState(() =>
    parseStoredSession() ? SCREENS.PROFILE : SCREENS.LOGIN,
  );
  const [pendingRegistration, setPendingRegistration] = useState({
    email: "",
    name: "",
    verificationToken: "",
  });

  useEffect(() => {
    if (authSession) {
      localStorage.setItem(AUTH_SESSION_STORAGE_KEY, JSON.stringify(authSession));
      return;
    }
    localStorage.removeItem(AUTH_SESSION_STORAGE_KEY);
  }, [authSession]);

  const effectiveScreen =
    !authSession &&
    (currentScreen === SCREENS.PROFILE || currentScreen === SCREENS.AQUARIUM || currentScreen === SCREENS.DETAIL)
      ? SCREENS.LOGIN
      : currentScreen;

  const handleLoginSuccess = ({ user, accessToken, refreshToken }) => {
    setAuthSession({ user, accessToken, refreshToken });
    setCurrentScreen(SCREENS.PROFILE);
  };

  const handleLogout = () => {
    setAuthSession(null);
    setCurrentScreen(SCREENS.LOGIN);
  };

  return (
    <div className="App bg-[#0B1120] min-h-dvh overflow-x-hidden">
      {effectiveScreen === SCREENS.LOGIN && (
        <LoginPage
          onSuccess={handleLoginSuccess}
          onNavigate={setCurrentScreen}
        />
      )}

      {effectiveScreen === SCREENS.REGISTER && (
        <RegisterPage
          onSuccess={(registrationData) => {
            setPendingRegistration(registrationData);
            setCurrentScreen(SCREENS.VERIFY_ACCOUNT);
          }}
          onNavigate={setCurrentScreen}
        />
      )}

      {effectiveScreen === SCREENS.VERIFY_ACCOUNT && (
        <VerifyAccountPage
          email={pendingRegistration.email}
          verificationToken={pendingRegistration.verificationToken}
          onTokenUpdate={(token) =>
            setPendingRegistration((prev) => ({
              ...prev,
              verificationToken: token,
            }))
          }
          onNavigate={setCurrentScreen}
          onSuccess={() => setCurrentScreen(SCREENS.WELCOME)}
        />
      )}

      {effectiveScreen === SCREENS.WELCOME && (
        <WelcomePage
          name={pendingRegistration.name}
          onContinue={() => setCurrentScreen(SCREENS.LOGIN)}
        />
      )}

      {effectiveScreen === SCREENS.PROFILE && (
        <ProfilePage
          onNavigate={setCurrentScreen}
          authUser={authSession?.user}
          accessToken={authSession?.accessToken}
          onLogout={handleLogout}
        />
      )}

      {}
      {effectiveScreen === SCREENS.AQUARIUM && (
        <OverviewPage onNavigate={setCurrentScreen} />
      )}

      {(effectiveScreen === SCREENS.PROFILE ||
        effectiveScreen === SCREENS.AQUARIUM) && (
        <UserBottomNav
          currentScreen={effectiveScreen}
          onNavigate={setCurrentScreen}
        />
      )}
      {effectiveScreen === SCREENS.DETAIL && (
        <MainDetail onNavigate={setCurrentScreen} />)}
    </div>
  );
}

export default App;
