import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import AppLayout from "../../../shared/components/AppLayout";
import Button from "../../../shared/components/Button";
import Modal from "../../../shared/components/Modal";
import { SCREENS } from "../../../shared/constants/screens";
import AddAquariumForm from "../components/AddAquariumForm.jsx";
import AquariumCard from "../components/AquariumCard.jsx";
import EmptyState from "../components/EmptyState.jsx";

const randomId = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `aq_${Date.now()}_${Math.random().toString(16).slice(2)}`;

const parseVolume = (raw) => {
  const n = Number(String(raw).replace(",", "."));
  return Number.isFinite(n) ? Math.max(0, Math.round(n)) : 0;
};

/**
 * Overview route: mock aquarium list, live-telemetry simulation, add flow (Czech UI).
 */
const OverviewPage = ({ onNavigate }) => {
  const [aquariums, setAquariums] = useState([]);
  const [liveById, setLiveById] = useState({});
  const [showAdd, setShowAdd] = useState(false);

  useEffect(() => {
    const tick = () => {
      setLiveById((prev) => {
        const next = { ...prev };
        aquariums.forEach((aq) => {
          if (!aq.isOnline) return;
          const drift = () => (Math.random() - 0.5) * 0.22;
          const temperature = +((aq.baseTemperature + drift()).toFixed(1));
          const marine = aq.type === "marine";
          next[aq.id] = {
            temperature,
            salinity: marine ? +((aq.baseSalinity + drift()).toFixed(1)) : null,
          };
        });
        return next;
      });
    };

    tick();
    const id = setInterval(tick, 1600);
    return () => clearInterval(id);
  }, [aquariums]);

  const subtitle = `${aquariums.length} zařízení`;

  const handleSave = (formData) => {
    const volumeLiters = parseVolume(formData.volumeLiters);
    const marine = formData.type === "marine";
    const baseSalinity = marine ? 34.4 + Math.random() * 0.8 : 0;
    const baseTemperature = 24.6 + Math.random() * 1.0;

    const warnDemo = /varování|warn/i.test(formData.name);
    const adjustedSalinity = warnDemo && marine ? 36.1 + Math.random() * 0.25 : baseSalinity;

    const isOnline = Math.random() > 0.12;

    const newAquarium = {
      id: randomId(),
      name: formData.name,
      volumeLiters,
      type: formData.type,
      note: formData.note,
      deviceAddress: formData.deviceAddress,
      isOnline,
      baseSalinity: adjustedSalinity,
      baseTemperature,
    };

    setAquariums((prev) => [...prev, newAquarium]);
    setLiveById((prev) => ({
      ...prev,
      [newAquarium.id]: isOnline
        ? {
            temperature: +baseTemperature.toFixed(1),
            salinity: marine ? +adjustedSalinity.toFixed(1) : null,
          }
        : undefined,
    }));
    setShowAdd(false);
  };

  const headerRight =
    aquariums.length === 0 ? (
      <Button
        type="button"
        className="hidden px-5 py-2.5 md:inline-flex"
        onClick={() => setShowAdd(true)}
      >
        + Přidat akvárium
      </Button>
    ) : (
      <>
        <Button
          variant="icon"
          type="button"
          className="md:hidden"
          aria-label="Přidat akvárium"
          onClick={() => setShowAdd(true)}
        >
          <Plus size={20} />
        </Button>
        <Button
          type="button"
          className="hidden px-5 py-2.5 md:inline-flex"
          onClick={() => setShowAdd(true)}
        >
          + Přidat akvárium
        </Button>
      </>
    );

  return (
    <>
      <AppLayout
        title="Moje akvária"
        subtitle={subtitle}
        headerRight={headerRight}
        layoutStyle="dashboard"
        activeScreen={SCREENS.AQUARIUM}
        onNavigate={onNavigate}
      >
        {aquariums.length === 0 ? (
          <EmptyState onAddClick={() => setShowAdd(true)} />
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6">
            {aquariums.map((aq) => (
              <AquariumCard key={aq.id} aquarium={aq} live={liveById[aq.id]} />
            ))}
          </div>
        )}
      </AppLayout>

      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Přidat akvárium">
        <AddAquariumForm onSave={handleSave} onCancel={() => setShowAdd(false)} />
      </Modal>
    </>
  );
};

export default OverviewPage;
