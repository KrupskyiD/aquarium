import { Navigate, Outlet } from "react-router-dom";
import { useAuthSession } from "../AuthSessionContext";

const RequireVerified = () => {
  const { authSession } = useAuthSession();

  if (authSession?.user?.is_verified !== true) {
    return <Navigate to="/verify" replace />;
  }

  return <Outlet />;
};

export default RequireVerified;
