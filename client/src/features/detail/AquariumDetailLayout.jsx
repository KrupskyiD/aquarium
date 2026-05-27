import { Navigate, Outlet, useParams } from "react-router-dom";
import { MetricsProvider } from "../../context/MetricsContext";
const AquariumDetailLayout = ({ hasAquarium, aquariumId }) => {
  const { aquariumId: routeAquariumId } = useParams();
  const hasMatchingAquarium =
    hasAquarium && aquariumId != null && String(aquariumId) === String(routeAquariumId);

  if (!hasMatchingAquarium) {
    return <Navigate to="/aquarium" replace />;
  }

  return (
    <MetricsProvider key={aquariumId ?? "unknown"}>
      <Outlet />
    </MetricsProvider>
  );
};

export default AquariumDetailLayout;
