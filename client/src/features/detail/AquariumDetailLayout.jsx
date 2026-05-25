import { Navigate, Outlet } from "react-router-dom";
import { MetricsProvider } from "../../context/MetricsContext";
const AquariumDetailLayout = ({ hasAquarium, aquariumId }) => {
  if (!hasAquarium) {
    return <Navigate to="/aquarium" replace />;
  }

  return (
    <MetricsProvider key={aquariumId ?? "unknown"}>
      <Outlet />
    </MetricsProvider>
  );
};

export default AquariumDetailLayout;
