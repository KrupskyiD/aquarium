/* eslint-disable react-refresh/only-export-components -- router module exports `appRouter` + `AppRouter` */
import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
  useLocation,
  useNavigate,
  useOutletContext,
  useSearchParams,
} from "react-router-dom";
import { useAuthSession } from "./AuthSessionContext";
import GuestOnly from "./routes/GuestOnly";
import RequireAuth from "./routes/RequireAuth";
import RequireVerified from "./routes/RequireVerified";
import AppShellLayout from "./AppShellLayout";
import AquariumMetricsLayout from "./routes/AquariumMetricsLayout";
import VerifiedApp from "./VerifiedApp";
import VerifyGate from "./VerifyGate";

import LoginPage from "../features/auth/pages/LoginPage";
import RegisterPage from "../features/auth/pages/RegisterPage";
import VerifyAccountPage from "../features/auth/pages/VerifyAccountPage";
import WelcomePage from "../features/auth/pages/WelcomePage";

import OverviewPage from "../features/overview/pages/OverviewPage";
import MainDetail from "../features/detail/pages/MainDetail";
import MetricDetailPage from "../features/detail/pages/MetricDetailPage";
import EditAquariumPage from "../features/detail/pages/EditAquariumPage";

import ProfilePage from "../features/user/pages/ProfilePage";
import EditProfilePage from "../features/user/pages/EditProfilePage";
import ChangePasswordPage from "../features/user/pages/ChangePasswordPage";
import AboutAppPage from "../features/user/pages/AboutAppPage";

const idKey = (id) => String(id);

const IndexRedirect = () => {
  const { authSession } = useAuthSession();

  if (!authSession?.accessToken) {
    return <Navigate to="/login" replace />;
  }

  if (authSession?.user?.is_verified !== true) {
    return <Navigate to="/verify" replace />;
  }

  return <Navigate to="/profile" replace />;
};

const LoginRoute = () => {
  const { setAuthSession } = useAuthSession();

  return (
    <LoginPage
      onSuccess={({ user, accessToken, refreshToken }) => {
        setAuthSession({ user, accessToken, refreshToken });
      }}
    />
  );
};

const VerifyRoute = () => {
  const location = useLocation();

  return (
    <VerifyAccountPage
      email={location.state?.email}
      verificationToken={location.state?.verificationToken}
    />
  );
};

const WelcomeRoute = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <WelcomePage
      name={location.state?.name}
      onContinue={() => navigate("/login", { replace: true })}
    />
  );
};

const VerifiedOverviewRoute = () => {
  const { onOpenAquariumDetail, aquariums, aquariumsLoading, onAddAquarium } =
    useOutletContext();

  return (
    <OverviewPage
      onOpenDetail={onOpenAquariumDetail}
      aquariums={aquariums}
      aquariumsLoading={aquariumsLoading}
      onAddAquarium={onAddAquarium}
    />
  );
};

const VerifiedAquariumDetailRoute = () => {
  const { selectedAquarium } = useOutletContext();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const aquariumId = searchParams.get("aquariumId");

  if (!aquariumId || !selectedAquarium) {
    return <Navigate to="/aquarium" replace />;
  }

  if (idKey(selectedAquarium.id) !== idKey(aquariumId)) {
    return <Navigate to="/aquarium" replace />;
  }

  return (
    <MainDetail
      aquarium={selectedAquarium}
      onOpenMetricDetail={(metricType) => {
        navigate(
          `/aquarium/metric?aquariumId=${encodeURIComponent(
            idKey(selectedAquarium.id),
          )}&metric=${encodeURIComponent(metricType)}`,
        );
      }}
      onOpenEdit={() =>
        navigate(`/aquarium/edit?aquariumId=${encodeURIComponent(idKey(selectedAquarium.id))}`)
      }
    />
  );
};

const VerifiedMetricRoute = () => {
  const { selectedAquarium } = useOutletContext();
  const [searchParams] = useSearchParams();

  const aquariumId = searchParams.get("aquariumId");
  const metric = searchParams.get("metric");
  const metricType = metric === "temperature" ? "temperature" : "salinity";

  if (!aquariumId || !selectedAquarium) {
    return <Navigate to="/aquarium" replace />;
  }

  if (idKey(selectedAquarium.id) !== idKey(aquariumId)) {
    return <Navigate to="/aquarium" replace />;
  }

  return <MetricDetailPage aquarium={selectedAquarium} metricType={metricType} />;
};

const VerifiedEditAquariumRoute = () => {
  const { selectedAquarium, onSaveAquarium, onDeleteAquarium } =
    useOutletContext();
  const [searchParams] = useSearchParams();
  const aquariumId = searchParams.get("aquariumId");

  if (!aquariumId || !selectedAquarium) {
    return <Navigate to="/aquarium" replace />;
  }

  if (idKey(selectedAquarium.id) !== idKey(aquariumId)) {
    return <Navigate to="/aquarium" replace />;
  }

  return (
    <EditAquariumPage
      aquarium={selectedAquarium}
      onSave={onSaveAquarium}
      onDelete={onDeleteAquarium}
    />
  );
};

const VerifiedProfileRoute = () => {
  const { authUser, accessToken, onLogout } = useOutletContext();
  return <ProfilePage authUser={authUser} accessToken={accessToken} onLogout={onLogout} />;
};

const VerifiedEditProfileRoute = () => {
  const { accessToken, authUser, setAuthSession } = useOutletContext();
  return (
    <EditProfilePage
      accessToken={accessToken}
      authUser={authUser}
      onProfileUpdated={(updatedUser) => {
        setAuthSession((prev) => (prev ? { ...prev, user: updatedUser } : prev));
      }}
    />
  );
};

const VerifiedChangePasswordRoute = () => {
  const { accessToken, onLogout } = useOutletContext();
  return <ChangePasswordPage accessToken={accessToken} onPasswordChanged={onLogout} />;
};

const VerifiedAboutRoute = () => {
  return <AboutAppPage />;
};

export const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <IndexRedirect />,
  },
  {
    element: <GuestOnly />,
    children: [
      { path: "/login", element: <LoginRoute /> },
      { path: "/register", element: <RegisterPage /> },
    ],
  },
  {
    path: "/verify",
    element: (
      <VerifyGate>
        <VerifyRoute />
      </VerifyGate>
    ),
  },
  {
    path: "/welcome",
    element: <WelcomeRoute />,
  },
  {
    element: <RequireAuth />,
    children: [
      {
        element: <RequireVerified />,
        children: [
          {
            element: <AppShellLayout />,
            children: [
              {
                element: <VerifiedApp />,
                children: [
                  { path: "/profile", element: <VerifiedProfileRoute /> },
                  { path: "/profile/edit", element: <VerifiedEditProfileRoute /> },
                  { path: "/profile/password", element: <VerifiedChangePasswordRoute /> },
                  { path: "/profile/about", element: <VerifiedAboutRoute /> },
                  {
                    element: <AquariumMetricsLayout />,
                    children: [
                      { path: "/aquarium", element: <VerifiedOverviewRoute /> },
                      { path: "/aquarium/detail", element: <VerifiedAquariumDetailRoute /> },
                      { path: "/aquarium/metric", element: <VerifiedMetricRoute /> },
                      { path: "/aquarium/edit", element: <VerifiedEditAquariumRoute /> },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);

export const AppRouter = () => {
  return <RouterProvider router={appRouter} />;
};
