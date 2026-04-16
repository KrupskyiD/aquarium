import { useState, useEffect } from "react";
import "./App.css";
import io from "socket.io-client";
import LoginPage from "./features/auth/pages/LoginPage";
import RegisterPage from "./features/auth/pages/RegisterPage";
import VerifyAccountPage from "./features/auth/pages/VerifyAccountPage";
import WelcomePage from "./features/auth/pages/WelcomePage";
import ProfilePage from "./features/user/pages/ProfilePage";
import AquariumManagePage from "./features/user/pages/AquariumManagePage";
import UserBottomNav from "./shared/components/UserBottomNav";
import { SCREENS } from "./shared/constants/screens";

const socket = io.connect("http://localhost:3001");

function App() {
  const [metrics, setMetrics] = useState({ temp: 0, salt: 0 });

  const [currentScreen, setCurrentScreen] = useState(SCREENS.PROFILE);
  const [pendingRegistration, setPendingRegistration] = useState({
    email: "",
    name: "",
  });

  useEffect(() => {
    socket.on("dashboard-metrics", (BEmetrics) => {
      setMetrics(BEmetrics);
    });
  }, []);

  return (
    <div className="App bg-[#0B1120] min-h-dvh overflow-x-hidden">
      {currentScreen === SCREENS.LOGIN && (
        <LoginPage
          onSuccess={() => setCurrentScreen(SCREENS.PROFILE)}
          onNavigate={setCurrentScreen}
        />
      )}

      {currentScreen === SCREENS.REGISTER && (
        <RegisterPage
          onSuccess={(registrationData) => {
            setPendingRegistration(registrationData);
            setCurrentScreen(SCREENS.VERIFY_ACCOUNT);
          }}
          onNavigate={setCurrentScreen}
        />
      )}

      {currentScreen === SCREENS.VERIFY_ACCOUNT && (
        <VerifyAccountPage
          email={pendingRegistration.email}
          onNavigate={setCurrentScreen}
          onSuccess={() => setCurrentScreen(SCREENS.WELCOME)}
        />
      )}

      {currentScreen === SCREENS.WELCOME && (
        <WelcomePage
          name={pendingRegistration.name}
          onContinue={() => setCurrentScreen(SCREENS.PROFILE)}
        />
      )}

      {currentScreen === SCREENS.PROFILE && (
        <ProfilePage onNavigate={setCurrentScreen} />
      )}

      {}
      {currentScreen === SCREENS.AQUARIUM && (
        <AquariumManagePage
          onNavigate={setCurrentScreen}
          temp={metrics.temp}
          salt={metrics.salt}
        />
      )}

      {(currentScreen === SCREENS.PROFILE ||
        currentScreen === SCREENS.AQUARIUM) && (
        <UserBottomNav
          currentScreen={currentScreen}
          onNavigate={setCurrentScreen}
        />
      )}
    </div>
  );
}

export default App;
