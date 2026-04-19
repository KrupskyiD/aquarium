import { useCallback, useEffect, useState } from "react";
import { Plus } from "lucide-react";
import AppLayout from "../../../shared/components/AppLayout";
import Button from "../../../shared/components/Button";
import Modal from "../../../shared/components/Modal";
import { SCREENS } from "../../../shared/constants/screens";
import AddAquariumForm from "../components/AddAquariumForm.jsx";
import AquariumCard from "../components/AquariumCard.jsx";
import EmptyState from "../components/EmptyState.jsx";
import { getAquariums, postAquarium } from "../api/aquariumApi.js";
import { mapAquariumRowToUi } from "../utils/mapAquariumDto.js";

/**
 * Overview route: persists aquariums via API; live telemetry simulated on the client for online tanks.
 */
const OverviewPage = ({ accessToken, onNavigate }) => {
  const [aquariums, setAquariums] = useState([]);
  const [liveById, setLiveById] = useState({});
  const [showAdd, setShowAdd] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  const refreshAquariums = useCallback(async () => {
    if (!accessToken) {
      setAquariums([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setLoadError(null);
    try {
      const res = await getAquariums(accessToken);
      if (res.status === "success" && Array.isArray(res.data)) {
        setAquariums(res.data.map(mapAquariumRowToUi));
      } else {
        setAquariums([]);
      }
    } catch (e) {
      setLoadError(e.message || "Chyba načítání");
      setAquariums([]);
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  useEffect(() => {
    refreshAquariums();
  }, [refreshAquariums]);

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

  const handleSave = async (formData) => {
    if (!accessToken) return;
    try {
      const payload = {
        name: formData.name,
        volume: Number.parseInt(formData.volumeLiters, 10),
        type: formData.type === "freshwater" ? "freshwater" : "marine",
        notes: formData.note || undefined,
        device_number: formData.deviceAddress,
      };
      const res = await postAquarium(accessToken, payload);
      if (res.status === "success" && res.data) {
        const ui = mapAquariumRowToUi(res.data);
        setAquariums((prev) => [...prev, ui]);
        setLiveById((prev) => ({
          ...prev,
          [ui.id]: ui.isOnline
            ? {
                temperature: +ui.baseTemperature.toFixed(1),
                salinity: ui.type === "marine" ? +ui.baseSalinity.toFixed(1) : null,
              }
            : undefined,
        }));
        setShowAdd(false);
      }
    } catch (e) {
      window.alert(e.message || "Akvárium se nepodařilo uložit.");
    }
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
        {loading ? (
          <p className="py-12 text-center text-sm text-slate-500">Načítání…</p>
        ) : loadError ? (
          <div className="rounded-xl border border-red-900/60 bg-red-950/40 px-4 py-8 text-center">
            <p className="text-sm text-red-200">{loadError}</p>
            <Button type="button" className="mt-4 px-6 py-2.5" onClick={() => refreshAquariums()}>
              Zkusit znovu
            </Button>
          </div>
        ) : aquariums.length === 0 ? (
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
