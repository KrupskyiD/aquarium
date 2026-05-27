import React, { useContext, useState } from 'react'
import { SCREENS } from "../../../shared/constants/screens";
import { MetricsContext } from '../../../context/MetricsContext.jsx'
import DesktopAppLayout from "../../../shared/components/DesktopAppLayout";
import DeleteConfirmationModal from "../../../shared/components/DeleteConfirmationModal";
import MetricCard from '../components/MetricCard'
import ButtonCard from '../components/ButtonCard'
import { resolveAquariumLiveMetrics } from '../utils/aquariumLiveMetrics'

const MainDetail = ({ onNavigate, aquarium, onOpenMetricDetail, onOpenEdit, onDelete }) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
   const { metrics: liveMetrics, history } = useContext(MetricsContext);
  const { isThisDevice, salinityNum, tempNum, limits } = resolveAquariumLiveMetrics(
    aquarium,
    liveMetrics,
  );

  const fmt = (n) => typeof n === "number" && Number.isFinite(n) ? n.toFixed(1) : "—";

  const displayMetrics = {
    salt: fmt(salinityNum),
    temp: fmt(tempNum),
    limits,
  };

const pageContent = (
    <div className="mt-4 flex w-full flex-col gap-4 md:mt-2">
      <div className="hidden items-center justify-between md:flex">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => onNavigate(SCREENS.AQUARIUM)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-700/50 bg-[#121A21]"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <h1 className="text-2xl font-bold">{aquarium?.name || "Hlavní nádrž"}</h1>
        </div>
      </div>
        <div className='text-slate-400 text-xs font-semibold tracking-wider uppercase'>Metriky — kliknutím zobrazíte grafy</div>
      <MetricCard
        value={displayMetrics.salt}
        status={displayMetrics.limits.salt}
        name='Salinita'
        unit="ppt"
        graphData={isThisDevice ? history.salt : []}
        onClick={() => onOpenMetricDetail?.("salinity")}
      />
      <MetricCard
        value={displayMetrics.temp}
        status={displayMetrics.limits.temp}
        name='Teplota'
        unit='°C'
        graphData={isThisDevice ? history.temp : []}
        onClick={() => onOpenMetricDetail?.("temperature")}
      />

      <div className='text-slate-400 text-xs font-semibold tracking-wider uppercase'>Správa zařízení</div>
      <ButtonCard
        title='Kalibrace'
        onClick={() =>
          onNavigate(SCREENS.CALIBRATION, undefined, {
            aquariumId: aquarium?.id,
          })
        }
      
    icon={
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3"></circle>
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
      </svg>
    }/>
      <ButtonCard title='Upravit' onClick={() => onOpenEdit?.()}
    icon={
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
      </svg>
    }/>
      <button
        type="button"
        onClick={() => setIsDeleteModalOpen(true)}
        className="flex w-full items-center justify-between rounded-2xl border border-[#7b2942] bg-[#2D191E] p-3 text-left transition-colors hover:bg-[#3a1522]"
      >
        <div className="flex min-w-0 items-center gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#4a1a2b]/60 text-[#ff5a78]">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path>
              <path d="M10 11v6"></path>
              <path d="M14 11v6"></path>
              <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"></path>
            </svg>
          </div>
          <span className="truncate text-[15px] font-medium text-[#ff5a78]">
            Odebrat akvárium
          </span>
        </div>
        <div className="flex shrink-0 items-center pr-1 text-[#ff5a78]/60">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </div>
      </button>
    </div>
  );


 
  const handleConfirmDelete = () => {
    if (!aquarium?.id) return;
    onDelete?.(aquarium.id);
    setIsDeleteModalOpen(false);
  };

  return (<>
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
      />
      {/* Mobile version */}
      <section className="min-h-screen bg-[#0B1120] px-5 pt-8 pb-28 text-white md:hidden">
        <div className="mx-auto flex min-h-[calc(100vh-9rem)] w-full max-w-[760px] flex-col">
          
          {/* header */}
          <div className="mb-8 flex items-center gap-4">
            <button 
              onClick={() => onNavigate(SCREENS.AQUARIUM)} 
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-700/50 bg-[#121A21]"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <h1 className="text-xl font-bold">{aquarium?.name || "Hlavní nádrž"}</h1>
          </div>

          {pageContent}
        </div>
      </section>

      {/* desktop version */}
      <div className="hidden md:block">
        <DesktopAppLayout
          title="Detail akvária"
          activeScreen={SCREENS.DETAIL}
          onNavigate={onNavigate}
        >
          {pageContent}
        </DesktopAppLayout>
      </div>
    </>
  );
}

export default MainDetail
