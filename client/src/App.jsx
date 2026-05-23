import { useState, useEffect, useCallback } from "react";
import { Navigate, Outlet, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import "./App.css";
import LoginPage from "./features/auth/pages/LoginPage";
import RegisterPage from "./features/auth/pages/RegisterPage";
import VerifyAccountPage from "./features/auth/pages/VerifyAccountPage";
import AquariumDetailLayout from "./features/detail/AquariumDetailLayout";
import MainDetail from "./features/detail/pages/MainDetail";
import MetricDetailPage from "./features/detail/pages/MetricDetailPage";
import EditAquariumPage from "./features/detail/pages/EditAquariumPage";
import WelcomePage from "./features/auth/pages/WelcomePage";
import ProfilePage from "./features/user/pages/ProfilePage";
import EditProfilePage from "./features/user/pages/EditProfilePage";
import ChangePasswordPage from "./features/user/pages/ChangePasswordPage";
import AboutAppPage from "./features/user/pages/AboutAppPage";
import OverviewPage from "./features/overview/pages/OverviewPage";
import UserBottomNav from "./shared/components/UserBottomNav";
import { SCREENS } from "./shared/constants/screens";
import { MetricsProvider } from "./context/MetricsContext";
import {
  fetchAquariums,
  fetchAquariumById,
  createAquarium,
  updateAquarium,
  deleteAquarium,
} from "./features/aquarium/api/aquariumApi";

const AUTH_SESSION_STORAGE_KEY = "saltguard.auth.session";
const SCREEN_PATHS = {
  [SCREENS.LOGIN]: "/login",
  [SCREENS.REGISTER]: "/register",
  [SCREENS.VERIFY_ACCOUNT]: "/verify-account",
  [SCREENS.WELCOME]: "/welcome",
  [SCREENS.PROFILE]: "/profile",
  [SCREENS.EDIT_PROFILE]: "/profile/edit",
  [SCREENS.CHANGE_PASSWORD]: "/profile/password",
  [SCREENS.ABOUT_APP]: "/profile/about",
  [SCREENS.AQUARIUM]: "/aquarium",
  [SCREENS.DETAIL]: "/aquarium/detail",
  [SCREENS.METRIC_DETAIL]: "/aquarium/metric",
  [SCREENS.EDIT_AQUARIUM]: "/aquarium/edit",
};
const PATH_TO_SCREEN = Object.fromEntries(
  Object.entries(SCREEN_PATHS).map(([screen, path]) => [path, screen]),
);
const BOTTOM_NAV_SCREENS = new Set([
  SCREENS.PROFILE,
  SCREENS.EDIT_PROFILE,
  SCREENS.CHANGE_PASSWORD,
  SCREENS.ABOUT_APP,
  SCREENS.AQUARIUM,
]);

const parseStoredSession = () => {
  try {
    const raw = localStorage.getItem(AUTH_SESSION_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const [authSession, setAuthSession] = useState(() => parseStoredSession());
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

  const currentScreen = PATH_TO_SCREEN[location.pathname] ?? null;
  const isAuthenticated = Boolean(authSession?.accessToken);

  const navigateToScreen = useCallback(
    (screen, options) => {
      const path = SCREEN_PATHS[screen];
      if (!path) return;
      navigate(path, options);
    },
    [navigate],
  );

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
  }, [authSession]);

  useEffect(() => {
    if (!authSession?.accessToken || currentScreen !== SCREENS.AQUARIUM) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadAquariums();
  }, [authSession, currentScreen, loadAquariums]);

  const handleLoginSuccess = ({ user, accessToken, refreshToken }) => {
    setAuthSession({ user, accessToken, refreshToken });
    navigateToScreen(SCREENS.PROFILE);
  };

  const handleLogout = () => {
    setAuthSession(null);
    navigateToScreen(SCREENS.LOGIN);
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
        device_serial: formData.device_number.trim(),
      });
      await loadAquariums();
    } catch (err) {
      console.error(err);
      throw err;
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
      navigateToScreen(SCREENS.DETAIL);
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
      navigateToScreen(SCREENS.AQUARIUM);
    } catch (err) {
      console.error(err);
    }
  };

  const openAquariumDetail = async (aquarium) => {
    if (!authSession?.accessToken) {
      setSelectedAquarium(aquarium);
      navigateToScreen(SCREENS.DETAIL);
      return;
    }
    try {
      const fresh = await fetchAquariumById(authSession.accessToken, aquarium.id);
      setSelectedAquarium(fresh ?? aquarium);
    } catch (err) {
      console.error(err);
      setSelectedAquarium(aquarium);
    }
    navigateToScreen(SCREENS.DETAIL);
  };

  const showBottomNav = currentScreen ? BOTTOM_NAV_SCREENS.has(currentScreen) : false;
  const bottomNavScreen =
    currentScreen === SCREENS.EDIT_PROFILE ||
    currentScreen === SCREENS.CHANGE_PASSWORD ||
    currentScreen === SCREENS.ABOUT_APP
      ? SCREENS.PROFILE
      : currentScreen;

  return (
    <div className="App bg-[#0B1120] min-h-dvh overflow-x-hidden">
      <Routes>
        <Route
          path="/"
          element={
            <Navigate
              to={isAuthenticated ? SCREEN_PATHS[SCREENS.PROFILE] : SCREEN_PATHS[SCREENS.LOGIN]}
              replace
            />
          }
        />
        <Route
          path={SCREEN_PATHS[SCREENS.LOGIN]}
          element={
            isAuthenticated ? (
              <Navigate to={SCREEN_PATHS[SCREENS.PROFILE]} replace />
            ) : (
              <LoginPage onSuccess={handleLoginSuccess} onNavigate={navigateToScreen} />
            )
          }
        />
        <Route
          path={SCREEN_PATHS[SCREENS.REGISTER]}
          element={
            isAuthenticated ? (
              <Navigate to={SCREEN_PATHS[SCREENS.PROFILE]} replace />
            ) : (
              <RegisterPage
                onSuccess={(registrationData) => {
                  setPendingRegistration(registrationData);
                  navigateToScreen(SCREENS.VERIFY_ACCOUNT);
                }}
                onNavigate={navigateToScreen}
              />
            )
          }
        />
        <Route
          path={SCREEN_PATHS[SCREENS.VERIFY_ACCOUNT]}
          element={
            isAuthenticated ? (
              <Navigate to={SCREEN_PATHS[SCREENS.PROFILE]} replace />
            ) : (
              <VerifyAccountPage
                email={pendingRegistration.email}
                verificationToken={pendingRegistration.verificationToken}
                onTokenUpdate={(token) =>
                  setPendingRegistration((prev) => ({
                    ...prev,
                    verificationToken: token,
                  }))
                }
                onNavigate={navigateToScreen}
                onSuccess={() => navigateToScreen(SCREENS.WELCOME)}
              />
            )
          }
        />
        <Route
          path={SCREEN_PATHS[SCREENS.WELCOME]}
          element={
            isAuthenticated ? (
              <Navigate to={SCREEN_PATHS[SCREENS.PROFILE]} replace />
            ) : (
              <WelcomePage
                name={pendingRegistration.name}
                onContinue={() => navigateToScreen(SCREENS.LOGIN)}
              />
            )
          }
        />
        <Route
          path={SCREEN_PATHS[SCREENS.PROFILE]}
          element={
            isAuthenticated ? (
              <ProfilePage
                onNavigate={navigateToScreen}
                authUser={authSession?.user}
                accessToken={authSession?.accessToken}
                onLogout={handleLogout}
              />
            ) : (
              <Navigate to={SCREEN_PATHS[SCREENS.LOGIN]} replace />
            )
          }
        />
        <Route
          path={SCREEN_PATHS[SCREENS.EDIT_PROFILE]}
          element={
            isAuthenticated ? (
              <EditProfilePage
                onNavigate={navigateToScreen}
                accessToken={authSession?.accessToken}
                authUser={authSession?.user}
                onProfileUpdated={(updatedUser) => {
                  setAuthSession((prev) =>
                    prev ? { ...prev, user: updatedUser } : prev,
                  );
                }}
              />
            ) : (
              <Navigate to={SCREEN_PATHS[SCREENS.LOGIN]} replace />
            )
          }
        />
        <Route
          path={SCREEN_PATHS[SCREENS.CHANGE_PASSWORD]}
          element={
            isAuthenticated ? (
              <ChangePasswordPage
                onNavigate={navigateToScreen}
                accessToken={authSession?.accessToken}
                onPasswordChanged={handleLogout}
              />
            ) : (
              <Navigate to={SCREEN_PATHS[SCREENS.LOGIN]} replace />
            )
          }
        />
        <Route
          path={SCREEN_PATHS[SCREENS.ABOUT_APP]}
          element={
            isAuthenticated ? (
              <AboutAppPage onNavigate={navigateToScreen} />
            ) : (
              <Navigate to={SCREEN_PATHS[SCREENS.LOGIN]} replace />
            )
          }
        />
        <Route
          path="/aquarium"
          element={
            isAuthenticated ? (
              <Outlet />
            ) : (
              <Navigate to={SCREEN_PATHS[SCREENS.LOGIN]} replace />
            )
          }
        >
          <Route
            index
            element={
              <MetricsProvider>
                <OverviewPage
                  onNavigate={navigateToScreen}
                  aquariums={aquariums}
                  aquariumsLoading={aquariumsLoading}
                  onAddAquarium={handleAddAquarium}
                  onOpenDetail={openAquariumDetail}
                />
              </MetricsProvider>
            }
          />
          <Route
            element={<AquariumDetailLayout hasAquarium={Boolean(selectedAquarium)} />}
          >
            <Route
              path="detail"
              element={
                <MainDetail
                  onNavigate={navigateToScreen}
                  aquarium={selectedAquarium}
                  onOpenMetricDetail={(metricType) => {
                    setSelectedMetric(metricType);
                    navigateToScreen(SCREENS.METRIC_DETAIL);
                  }}
                  onOpenEdit={() => navigateToScreen(SCREENS.EDIT_AQUARIUM)}
                />
              }
            />
            <Route
              path="metric"
              element={
                <MetricDetailPage
                  aquarium={selectedAquarium}
                  metricType={selectedMetric}
                  onNavigate={navigateToScreen}
                />
              }
            />
          </Route>
        </Route>
        <Route
          path={SCREEN_PATHS[SCREENS.EDIT_AQUARIUM]}
          element={
            isAuthenticated ? (
              selectedAquarium ? (
                <EditAquariumPage
                  aquarium={selectedAquarium}
                  onNavigate={navigateToScreen}
                  onSave={handleSaveAquarium}
                  onDelete={handleDeleteAquarium}
                />
              ) : (
                <Navigate to={SCREEN_PATHS[SCREENS.AQUARIUM]} replace />
              )
            ) : (
              <Navigate to={SCREEN_PATHS[SCREENS.LOGIN]} replace />
            )
          }
        />
        <Route
          path="*"
          element={
            <Navigate
              to={isAuthenticated ? SCREEN_PATHS[SCREENS.PROFILE] : SCREEN_PATHS[SCREENS.LOGIN]}
              replace
            />
          }
        />
      </Routes>
      {showBottomNav && (
        <UserBottomNav
          currentScreen={bottomNavScreen}
          onNavigate={navigateToScreen}
        />
      )}
    </div>
  );
}


export default App;