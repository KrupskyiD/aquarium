import { Navigate, Outlet } from "react-router-dom";
import { useAuthSession } from "../AuthSessionContext";

const GuestOnly = () => {
  const { authSession } = useAuthSession();

  if (!authSession?.accessToken) {
    return <Outlet />;
  }

  if (authSession?.user?.is_verified === true) {
    return <Navigate to="/profile" replace />;
  }

  return <Navigate to="/verify" replace />;
};

export default GuestOnly;
