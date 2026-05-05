import { Navigate } from "react-router-dom";
import { useAuthSession } from "./AuthSessionContext";

const VerifyGate = ({ children }) => {
  const { authSession } = useAuthSession();

  if (authSession?.accessToken && authSession?.user?.is_verified === true) {
    return <Navigate to="/profile" replace />;
  }

  return children;
};

export default VerifyGate;
