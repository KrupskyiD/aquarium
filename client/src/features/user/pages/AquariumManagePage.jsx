import AppShell from "../../../shared/components/AppShell";
import PrimaryCard from "../../../shared/components/PrimaryCard";
import TopBar from "../../../shared/components/TopBar";
import { SCREENS } from "../../../shared/constants/screens";
import AquariumHeaderCard from "../components/AquariumHeaderCard";
import MetricTile from "../components/MetricTile";

const AquariumManagePage = ({ onNavigate, temp, salt }) => {
  return (
    <AppShell>
      <PrimaryCard contentClassName="pb-6">
        <TopBar title="Správa akvária" onBack={() => onNavigate?.(SCREENS.PROFILE)} />

        <div className="px-6 pt-5">
          <div className="bg-[var(--auth-input-bg)] border border-[var(--auth-input-border)] p-5 rounded-2xl mb-6">
            <AquariumHeaderCard />

            <div className="grid grid-cols-2 gap-4">
              <MetricTile label="Salinita" value={salt || "34.8"} unit="ppt" />
              <MetricTile label="Teplota" value={temp || "25.4"} unit="°C" />
            </div>
          </div>
        </div>
      </PrimaryCard>
    </AppShell>
  );
};

export default AquariumManagePage;