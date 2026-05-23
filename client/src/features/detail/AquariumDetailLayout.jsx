import { Navigate, Outlet } from "react-router-dom";
import { MetricsProvider } from "../../context/MetricsContext";
const AquariumDetailLayout = ({ hasAquarium }) => {
  if (!hasAquarium) {
    return <Navigate to="/aquarium" replace />;
  }

  return (
    <MetricsProvider>
      <Outlet />
    </MetricsProvider>
  );
};

export default AquariumDetailLayout;
