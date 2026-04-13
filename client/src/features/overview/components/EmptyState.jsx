import { Fish } from "lucide-react";
import Button from "../../../shared/components/Button";

/**
 * Empty list placeholder for the aquarium overview (Czech UI).
 */
const EmptyState = ({ onAddClick }) => {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-16 text-center md:py-24">
      <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full border border-[#2a3f8f] bg-[#12214c] shadow-[0_0_40px_rgba(37,99,235,0.12)]">
        <Fish size={44} className="text-blue-300" aria-hidden />
      </div>
      <h2 className="mb-2 text-xl font-bold text-white">Žádná akvária</h2>
      <p className="mb-10 max-w-sm text-sm text-slate-400">
        Připojte první akvárium a začněte sledovat data
      </p>
      <Button type="button" onClick={onAddClick} className="px-8 py-3.5 text-[15px]">
        + Přidat akvárium
      </Button>
    </div>
  );
};

export default EmptyState;
