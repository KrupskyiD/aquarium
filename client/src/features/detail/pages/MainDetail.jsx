import React, { useEffect, useRef, useState } from 'react'
import { SCREENS } from "../../../shared/constants/screens";
import DesktopAppLayout from "../../../shared/components/DesktopAppLayout";
import MetricCard from '../components/MetricCard'
import ButtonCard from '../components/ButtonCard'
import { useSocket } from "../../../context/SocketContext.jsx"

const DEFAULT_LIMITS = {
  salt: { text: "pod cílem", difference: 2 },
  temp: { text: "v normě", difference: 0 },
};

const MainDetail = ({ onNavigate, aquarium, onOpenMetricDetail, onOpenEdit }) => {
    const socket = useSocket();
    const currentAquariumId = aquarium?.id;
    const lastAquariumIdRef = useRef(null);

    const [currentMetrics, setCurrentMetrics] = useState(() => ({
      salinity: Number(aquarium?.salinity ?? 34.89),
      temperature: Number(aquarium?.temperature ?? 28),
      limits: { ...DEFAULT_LIMITS },
    }));

    useEffect(() => {
      if (aquarium?.id == null) return;
      const switchedTank = lastAquariumIdRef.current !== aquarium.id;
      lastAquariumIdRef.current = aquarium.id;

      setCurrentMetrics((prev) => ({
        salinity: Number(aquarium.salinity ?? prev.salinity ?? 34.89),
        temperature: Number(aquarium.temperature ?? prev.temperature ?? 28),
        limits: switchedTank ? { ...DEFAULT_LIMITS } : prev.limits,
      }));
    }, [aquarium?.id, aquarium?.salinity, aquarium?.temperature]);

    useEffect(() => {
      if (!socket || currentAquariumId == null) return;

      const onSensorUpdate = (incomingData) => {
        const payloadId = incomingData?.aquarium_id;
        if (payloadId == null || Number(payloadId) !== Number(currentAquariumId)) return;

        const nextSalt =
          incomingData.salt ?? incomingData.salinity;
        const nextTemp =
          incomingData.temp ?? incomingData.temperature;
        const limitsPayload = incomingData.limits ?? incomingData.limitsStatus;

        setCurrentMetrics((prev) => ({
          salinity: nextSalt != null ? Number(nextSalt) : prev.salinity,
          temperature: nextTemp != null ? Number(nextTemp) : prev.temperature,
          limits: limitsPayload
            ? {
                salt: limitsPayload.salt ?? prev.limits.salt,
                temp: limitsPayload.temp ?? prev.limits.temp,
              }
            : prev.limits,
        }));
      };

      socket.on("sensor_update", onSensorUpdate);
      return () => {
        socket.off("sensor_update", onSensorUpdate);
      };
    }, [socket, currentAquariumId]);

    const metrics = {
      salt: currentMetrics.salinity.toFixed(1),
      temp: currentMetrics.temperature.toFixed(1),
      limits: currentMetrics.limits,
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
        value={metrics.salt}
        status={metrics.limits.salt}
        name='Salinita'
        unit="ppt"
        onClick={() => onOpenMetricDetail?.("salinity")}
      />
      <MetricCard
        value={metrics.temp}
        status={metrics.limits.temp}
        name='Teplota'
        unit='°C'
        onClick={() => onOpenMetricDetail?.("temperature")}
      />

      <div className='text-slate-400 text-xs font-semibold tracking-wider uppercase'>Správa zařízení</div>
      <ButtonCard title='Kalibrace' onClick={() => console.log('Open calibration')}
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
    </div>
  );


 
  return (<>
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

