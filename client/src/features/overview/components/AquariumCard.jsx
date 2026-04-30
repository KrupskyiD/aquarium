import React from "react";

const SensorTile = ({ label, value, unit }) => {
  return (
    <div className="rounded-xl border border-[#12345f] bg-[#0b1a33] p-3">
      <p className="text-xs uppercase tracking-[0.08em] text-slate-400">{label}</p>
      <div className="mt-2 flex items-end gap-1">
        <span className="text-2xl font-semibold text-white">{value.toFixed(1)}</span>
        <span className="pb-1 text-xs text-slate-300">{unit}</span>
      </div>
    </div>
  );
};

const AquariumCard = ({ aquarium, onOpenDetail }) => {
  return (
    <article
      onClick={() => onOpenDetail?.(aquarium)}
      className="cursor-pointer rounded-2xl border border-[#1f4576] bg-[#10233f] p-4 shadow-[0_16px_36px_rgba(1,10,30,0.45)] transition-colors hover:border-[#2a5e9f]"
    >
      <h3 className="text-lg font-bold text-white">{aquarium.name}</h3>

      <p className="mt-2 text-sm text-slate-300">
        {aquarium.typeLabel} • {aquarium.volumeLiters} L
      </p>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <SensorTile label="Slanost" value={aquarium.salinity} unit="ppt" />
        <SensorTile label="Teplota" value={aquarium.temperature} unit="°C" />
      </div>
    </article>
  );
};

export default AquariumCard;
