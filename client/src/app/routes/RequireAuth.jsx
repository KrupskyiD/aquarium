import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthSession } from "../AuthSessionContext";

const RequireAuth = () => {
  const location = useLocation();
  const { authSession } = useAuthSession();

  if (!authSession?.accessToken) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
};

export default RequireAuth;
