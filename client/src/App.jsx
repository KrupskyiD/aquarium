import { useState, useEffect, useCallback } from "react";
import "./App.css";
import LoginPage from "./features/auth/pages/LoginPage";
import RegisterPage from "./features/auth/pages/RegisterPage";
import VerifyAccountPage from "./features/auth/pages/VerifyAccountPage";
import MainDetail from "./features/detail/pages/MainDetail";
import MetricDetailPage from "./features/detail/pages/MetricDetailPage";
import EditAquariumPage from "./features/detail/pages/EditAquariumPage";
import WelcomePage from "./features/auth/pages/WelcomePage";
import ProfilePage from "./features/user/pages/ProfilePage";
import OverviewPage from "./features/overview/pages/OverviewPage";
import UserBottomNav from "./shared/components/UserBottomNav";
import { SCREENS } from "./shared/constants/screens";
import {
  fetchAquariums,
  fetchAquariumById,
  createAquarium,
  updateAquarium,
  deleteAquarium,
} from "./features/aquarium/api/aquariumApi";

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
  const [currentScreen, setCurrentScreen] = useState(() =>
    parseStoredSession() ? SCREENS.PROFILE : SCREENS.LOGIN,
  );
  const [aquariums, setAquariums] = useState([]);
  const [aquariumsLoading, setAquariumsLoading] = useState(false);
  const [selectedAquarium, setSelectedAquarium] = useState(null);
  const [selectedMetric, setSelectedMetric] = useState("salinity");
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
    (
      currentScreen === SCREENS.PROFILE ||
      currentScreen === SCREENS.AQUARIUM ||
      currentScreen === SCREENS.DETAIL ||
      currentScreen === SCREENS.METRIC_DETAIL ||
      currentScreen === SCREENS.EDIT_AQUARIUM
    )
      ? SCREENS.LOGIN
      : currentScreen;

  const loadAquariums = useCallback(async () => {
    if (!authSession?.accessToken) return;
    setAquariumsLoading(true);
    try {
      const list = await fetchAquariums(authSession.accessToken);
      setAquariums(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error(err);
      setAquariums([]);
    } finally {
      setAquariumsLoading(false);
    }
  }, [authSession?.accessToken]);

  useEffect(() => {
    if (!authSession?.accessToken || effectiveScreen !== SCREENS.AQUARIUM) return;
    loadAquariums();
  }, [authSession?.accessToken, effectiveScreen, loadAquariums]);

  const handleLoginSuccess = ({ user, accessToken, refreshToken }) => {
    setAuthSession({ user, accessToken, refreshToken });
    setCurrentScreen(SCREENS.PROFILE);
  };

  const handleLogout = () => {
    setAuthSession(null);
    setCurrentScreen(SCREENS.LOGIN);
    setAquariums([]);
    setSelectedAquarium(null);
  };

  const handleAddAquarium = async (formData) => {
    if (!authSession?.accessToken) return;
    try {
      await createAquarium(authSession.accessToken, {
        name: formData.name.trim(),
        volume: formData.volume,
        type: formData.type,
        device_number: formData.device_number.trim(),
      });
      await loadAquariums();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveAquarium = async ({ id, name, volume, type }) => {
    if (!authSession?.accessToken) return;
    try {
      const updated = await updateAquarium(authSession.accessToken, id, {
        name,
        volume,
        type,
      });
      if (updated) {
        setAquariums((prev) =>
          prev.map((a) => (a.id === updated.id ? updated : a)),
        );
        setSelectedAquarium((prev) =>
          prev && prev.id === updated.id ? updated : prev,
        );
      }
      setCurrentScreen(SCREENS.DETAIL);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteAquarium = async (aquariumId) => {
    if (!authSession?.accessToken) return;
    try {
      await deleteAquarium(authSession.accessToken, aquariumId);
      setAquariums((prev) => prev.filter((a) => a.id !== aquariumId));
      setSelectedAquarium(null);
      setCurrentScreen(SCREENS.AQUARIUM);
    } catch (err) {
      console.error(err);
    }
  };

  const openAquariumDetail = async (aquarium) => {
    if (!authSession?.accessToken) {
      setSelectedAquarium(aquarium);
      setCurrentScreen(SCREENS.DETAIL);
      return;
    }
    try {
      const fresh = await fetchAquariumById(authSession.accessToken, aquarium.id);
      setSelectedAquarium(fresh ?? aquarium);
    } catch (err) {
      console.error(err);
      setSelectedAquarium(aquarium);
    }
    setCurrentScreen(SCREENS.DETAIL);
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

      {effectiveScreen === SCREENS.AQUARIUM && (
        <OverviewPage
          onNavigate={setCurrentScreen}
          aquariums={aquariums}
          aquariumsLoading={aquariumsLoading}
          onAddAquarium={handleAddAquarium}
          onOpenDetail={openAquariumDetail}
        />
      )}

      {(effectiveScreen === SCREENS.PROFILE ||
        effectiveScreen === SCREENS.AQUARIUM) && (
        <UserBottomNav
          currentScreen={effectiveScreen}
          onNavigate={setCurrentScreen}
        />
      )}
      {effectiveScreen === SCREENS.DETAIL && (
        <MainDetail
          onNavigate={setCurrentScreen}
          aquarium={selectedAquarium}
          onOpenMetricDetail={(metricType) => {
            setSelectedMetric(metricType);
            setCurrentScreen(SCREENS.METRIC_DETAIL);
          }}
          onOpenEdit={() => setCurrentScreen(SCREENS.EDIT_AQUARIUM)}
        />
      )}
      {effectiveScreen === SCREENS.METRIC_DETAIL && (
        <MetricDetailPage
          aquarium={selectedAquarium}
          metricType={selectedMetric}
          onNavigate={setCurrentScreen}
        />
      )}
      {effectiveScreen === SCREENS.EDIT_AQUARIUM && (
        <EditAquariumPage
          aquarium={selectedAquarium}
          onNavigate={setCurrentScreen}
          onSave={handleSaveAquarium}
          onDelete={handleDeleteAquarium}
        />
      )}
    </div>
  );
}


export default App;