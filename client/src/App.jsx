import { useState, useEffect } from "react";
import "./App.css";
import io from "socket.io-client";
import LoginPage from "./features/auth/pages/LoginPage";
import RegisterPage from "./features/auth/pages/RegisterPage";
import ProfilePage from "./features/user/pages/ProfilePage";
import AquariumManagePage from "./features/user/pages/AquariumManagePage";

const socket = io.connect("http://localhost:3001");

function App() {
  const [metrics, setMetrics] = useState({ temp: 0, salt: 0 });

  const [currentScreen, setCurrentScreen] = useState("login");

  useEffect(() => {
    socket.on("dashboard-metrics", (BEmetrics) => {
      setMetrics(BEmetrics);
    });
  }, []);

  return (
    <div className="App bg-[#0B1120] min-h-dvh overflow-x-hidden">
      {currentScreen === "login" && (
        <LoginPage
          onSuccess={() => setCurrentScreen("profile")}
          onNavigate={setCurrentScreen}
        />
      )}

      {currentScreen === "register" && (
        <RegisterPage
          onSuccess={() => setCurrentScreen("profile")}
          onNavigate={setCurrentScreen}
        />
      )}

      {currentScreen === "profile" && (
        <ProfilePage onNavigate={setCurrentScreen} />
      )}

      {}
      {currentScreen === "aquarium" && (
        <AquariumManagePage
          onNavigate={setCurrentScreen}
          temp={metrics.temp}
          salt={metrics.salt}
        />
      )}
    </div>
  );
}

export default App;
