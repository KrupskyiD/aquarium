import { Fish } from "lucide-react";

const AquariumHeaderCard = () => {
  return (
    <div className="flex items-center mb-6">
      <div className="w-12 h-12 bg-[var(--auth-link)] rounded-xl flex items-center justify-center mr-4">
        <Fish size={24} color="white" />
      </div>
      <div className="flex-1">
        <h2 className="text-lg font-bold text-white leading-tight">Hlavní nádrž</h2>
        <p className="text-xs text-[var(--auth-text-muted)] font-medium tracking-tight">
          250 litrů · mořské
        </p>
      </div>
      <span className="px-3 py-1 bg-green-500/10 text-green-500 text-[10px] font-bold rounded-full border border-green-500/20 uppercase tracking-wider">
        Online
      </span>
    </div>
  );
};

export default AquariumHeaderCard;
