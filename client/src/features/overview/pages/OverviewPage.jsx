import { useState, useContext } from "react";
import { SCREENS } from "../../../shared/constants/screens";
import DesktopAppLayout from "../../../shared/components/DesktopAppLayout";
import AddAquariumForm from "../components/AddAquariumForm";
import AquariumList from "../components/AquariumList";
import EmptyState from "../components/EmptyState";
import { MetricsContext } from "../../../context/MetricsContext";

const OverviewPage = ({
  onNavigate,
  onOpenDetail,
  aquariums,
  aquariumsLoading,
  onAddAquarium,
}) => {
  const [view, setView] = useState("list");

  const { metrics: liveMetrics } = useContext(MetricsContext);

  const hasAquariums = aquariums.length > 0;

  const listContent = (
    <div className="flex flex-1 items-start justify-center py-3 sm:py-6 md:py-8">
      {aquariumsLoading ? (
        <p className="text-sm text-slate-400">Načítám akvária…</p>
      ) : hasAquariums ? (
        <AquariumList
          aquariums={aquariums}
          liveMetrics={liveMetrics}
          onAddAquarium={() => setView("form")}
          onOpenDetail={onOpenDetail}
        />
      ) : (
        <div className="flex w-full flex-1 items-center justify-center py-2 md:py-4">
          <EmptyState onAddAquarium={() => setView("form")} />
        </div>
      )}
    </div>
  );

  const formContent = (
    <div className="flex flex-1 items-start justify-center py-3 sm:py-6 md:py-8">
      <AddAquariumForm
        onCancel={() => setView("list")}
        onAdd={(formData) => {
          onAddAquarium?.(formData);
          setView("list");
        }}
      />
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