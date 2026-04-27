import { useState } from "react";
import { SCREENS } from "../../../shared/constants/screens";
import DesktopAppLayout from "../../../shared/components/DesktopAppLayout";
import AddAquariumForm from "../components/AddAquariumForm";
import AquariumList from "../components/AquariumList";
import EmptyState from "../components/EmptyState";

const OverviewPage = ({ onNavigate }) => {
  const [view, setView] = useState("list");
  const [aquariums, setAquariums] = useState([]);
  const hasAquariums = aquariums.length > 0;

  const handleAddAquarium = (formData) => {
    const createdAquarium = {
      id: crypto.randomUUID(),
      name: formData.name.trim(),
      volumeLiters: Number(formData.volumeLiters),
      type: formData.aquariumType,
      typeLabel: formData.aquariumType === "marine" ? "Mořské" : "Sladkovodní",
      deviceNumber: formData.deviceNumber.trim(),
      salinity: 35.2,
      temperature: 25.4,
    };

    setAquariums((prev) => [createdAquarium, ...prev]);
    setView("list");
  };

  const listContent = (
    <div className="flex flex-1 items-start justify-center py-3 sm:py-6 md:py-8">
      {hasAquariums ? (
        <AquariumList aquariums={aquariums} onAddAquarium={() => setView("form")} />
      ) : (
        <div className="flex w-full flex-1 items-center justify-center py-2 md:py-4">
          <EmptyState onAddAquarium={() => setView("form")} />
        </div>
      )}
    </div>
  );

  const formContent = (
    <div className="flex flex-1 items-start justify-center py-3 sm:py-6 md:py-8">
      <AddAquariumForm onCancel={() => setView("list")} onAdd={handleAddAquarium} />
    </div>
  );

  const pageContent = view === "form" ? formContent : listContent;

  return (
    <>
      <section className="min-h-screen bg-[#031427] px-5 pt-8 pb-28 text-white md:hidden">
        <div className="mx-auto flex min-h-[calc(100vh-9rem)] w-full max-w-[760px] flex-col">
          {pageContent}
        </div>
      </section>

      <div className="hidden md:block">
        <DesktopAppLayout
          title="Přehled akvárií"
          activeScreen={SCREENS.AQUARIUM}
          onNavigate={onNavigate}
        >
          {pageContent}
        </DesktopAppLayout>
      </div>
    </>
  );
};

export default OverviewPage;
