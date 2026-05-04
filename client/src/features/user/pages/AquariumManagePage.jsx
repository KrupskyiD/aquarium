import { SCREENS } from "../../../shared/constants/screens";
import DesktopAppLayout from "../../../shared/components/DesktopAppLayout";
import AquariumHeaderCard from "../components/AquariumHeaderCard";
import MetricTile from "../components/MetricTile";

const AquariumManagePage = ({ onNavigate, temp, salt }) => {
  return (
    <DesktopAppLayout
      title="Akvária"
      activeScreen={SCREENS.AQUARIUM}
      onNavigate={onNavigate}
    >
      <div className="max-w-[740px]">
        <div className="bg-[#0f1630] border border-[#1a2346] p-5 rounded-xl mb-6">
          <AquariumHeaderCard />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <MetricTile label="Salinita" value={salt || "34.8"} unit="ppt" />
            <MetricTile label="Teplota" value={temp || "25.4"} unit="°C" />
          </div>
        </div>
      </div>
    </DesktopAppLayout>
  );
};

export default AquariumManagePage;