import { Outlet } from "react-router-dom";
import { MetricsProvider } from "../../context/MetricsContext";

const AquariumMetricsLayout = () => {
  return (
    <MetricsProvider>
      <Outlet />
    </MetricsProvider>
  );
};

export default AquariumMetricsLayout;
