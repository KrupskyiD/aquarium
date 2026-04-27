import { Fish, Plus } from "lucide-react";
import Button from "../../../shared/components/Button";

const EmptyState = ({ onAddAquarium }) => {
  return (
    <section className="mx-auto flex w-full max-w-[460px] flex-col items-center justify-center text-center">
      <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-[#0f1a2c] shadow-[0_12px_35px_rgba(2,6,23,0.55)]">
        <Fish size={34} className="text-white" />
      </div>

      <h2 className="text-3xl font-bold text-white">Žádná akvária</h2>
      <p className="mt-3 max-w-[320px] text-base text-slate-400">
        Připojte první akvárium a začněte sledovat data
      </p>

      <Button onClick={onAddAquarium} className="mt-8">
        <Plus size={20} />
        Přidat akvárium
      </Button>
    </section>
  );
};

export default EmptyState;
