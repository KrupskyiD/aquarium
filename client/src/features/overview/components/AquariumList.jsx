import React from "react";
import { Plus } from "lucide-react";
import AquariumCard from "./AquariumCard";

const formatCount = (count) => {
  if (count === 1) return "1 zařízení";
  if (count >= 2 && count <= 4) return `${count} zařízení`;
  return `${count} zařízení`;
};

const AquariumList = ({ aquariums, onAddAquarium, onOpenDetail, liveMetrics }) => {
  return (
    <section className="w-full">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-white">Moje akvária</h1>
          <p className="mt-1 text-sm text-slate-400">{formatCount(aquariums.length)}</p>
        </div>
        <button
          type="button"
          onClick={onAddAquarium}
          aria-label="Přidat akvárium"
          className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-[#4d8cff] bg-[#3a7be6] text-white shadow-[0_10px_24px_rgba(58,123,230,0.45)] transition-colors hover:bg-[#4c8ff8]"
        >
          <Plus size={20} />
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {aquariums.map((aquarium) => (
          <AquariumCard key={aquarium.id} aquarium={aquarium} onOpenDetail={onOpenDetail} liveMetrics={liveMetrics}/>
        ))}
      </div>
    </section>
  );
};

export default AquariumList;
