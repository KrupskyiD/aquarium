import React from "react";
import { formatAquariumSubtitle } from "../../aquarium/utils/normalizeAquarium";

const SensorTile = ({ label, value, unit }) => {
  const display =
    typeof value === "number" && Number.isFinite(value) ? value.toFixed(1) : "—";
  return (
    <div className="rounded-xl border border-[#12345f] bg-[#0b1a33] p-3">
      <p className="text-xs uppercase tracking-[0.08em] text-slate-400">{label}</p>
      <div className="mt-2 flex items-end gap-1">
        <span className="text-2xl font-semibold text-white">{display}</span>
        {typeof value === "number" && Number.isFinite(value) ? (
          <span className="pb-1 text-xs text-slate-300">{unit}</span>
        ) : null}
      </div>
    </div>
  );
};

const AquariumCard = ({ aquarium, onOpenDetail, liveMetrics }) => {
  const latest = aquarium.metrics?.[0];
  // Логика фоллбэка, как в MainDetail
  // Важное уточнение: если у тебя будет МНОГО аквариумов, тебе нужно будет сверять 
  // liveMetrics.device_serial с aquarium.device_serial, чтобы не засунуть температуру 
  // первого аквариума во второй.
  const hasLiveData = liveMetrics && liveMetrics.temp !== null;
  // Если устройство совпадает (или если аквариум пока один), берем сокет, иначе БД
  const isThisDevice = hasLiveData && liveMetrics.device_serial === aquarium.device_serial;

  const salinity = isThisDevice
    ? Number(liveMetrics.salt)
    : latest?.salinity != null ? Number(latest.salinity) : null;

  const temperature = isThisDevice
    ? Number(liveMetrics.temp)
    : latest?.temperature != null ? Number(latest.temperature) : null;

  const openDetail = () => onOpenDetail?.(aquarium);

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={openDetail}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openDetail();
        }
      }}
      className="cursor-pointer rounded-2xl border border-[#1f4576] bg-[#10233f] p-4 shadow-[0_16px_36px_rgba(1,10,30,0.45)] transition-colors hover:border-[#2a5e9f] focus:outline-none focus:ring-2 focus:ring-blue-500/60"
    >
      <h3 className="text-lg font-bold text-white">{aquarium.name}</h3>

      <p className="mt-2 text-sm text-slate-300">{formatAquariumSubtitle(aquarium)}</p>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <SensorTile label="Slanost" value={salinity} unit="ppt" />
        <SensorTile label="Teplota" value={temperature} unit="°C" />
      </div>
    </article>
  );
};

export default AquariumCard;