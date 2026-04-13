import { Fish, Thermometer } from "lucide-react";
import Badge from "../../../shared/components/Badge";

const typeLabel = (type) => (type === "marine" ? "mořské" : "sladkovodní");

const clampPct = (value, min, max) => {
  if (max <= min) return 0;
  return Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));
};

/**
 * Segmented bar used as a subtle live telemetry visualization.
 */
const SegmentBar = ({ valuePct, tone = "blue" }) => {
  const segments = 12;
  const filled = Math.round((valuePct / 100) * segments);
  const active =
    tone === "warning"
      ? "bg-amber-400/90 shadow-[0_0_12px_rgba(251,191,36,0.35)]"
      : "bg-blue-400/90 shadow-[0_0_12px_rgba(96,165,250,0.22)]";
  const idle = tone === "warning" ? "bg-amber-900/35" : "bg-slate-800/70";

  return (
    <div className="mt-2 grid grid-cols-12 gap-1">
      {Array.from({ length: segments }).map((_, i) => (
        <span
          key={`seg-${i}`}
          className={`h-1.5 rounded-full ${i < filled ? active : idle}`}
        />
      ))}
    </div>
  );
};

/**
 * Aquarium dashboard card with live salinity/temperature and warning/offline states.
 */
const AquariumCard = ({ aquarium, live }) => {
  const { name, volumeLiters, type, deviceAddress, note, isOnline } = aquarium;

  const salinity = live?.salinity;
  const temperature = live?.temperature;

  const marine = type === "marine";
  const salinityNum = typeof salinity === "number" ? salinity : null;
  const tempNum = typeof temperature === "number" ? temperature : null;

  const salinityWarning =
    isOnline && marine && salinityNum != null && (salinityNum > 35.5 || salinityNum < 33);

  const detailParts = [
    volumeLiters ? `${volumeLiters} l` : null,
    typeLabel(type),
    deviceAddress ? deviceAddress : null,
  ].filter(Boolean);

  const saltPct =
    marine && salinityNum != null ? clampPct(salinityNum, 30, 40) : clampPct(salinityNum ?? 0, 0, 1);
  const tempPct = tempNum != null ? clampPct(tempNum, 20, 30) : 0;

  const dimmed = !isOnline;

  return (
    <article
      className={`relative overflow-hidden rounded-2xl border p-5 transition-colors ${
        dimmed
          ? "border-slate-700/60 bg-slate-950/40 opacity-[0.92]"
          : "border-[#1a2346] bg-[#0a1022] hover:border-[#2a3f8f]"
      }`}
    >
      {!dimmed && salinityWarning ? (
        <div className="absolute right-4 top-4">
          <Badge variant="warning">Varování</Badge>
        </div>
      ) : null}

      <div className="flex items-start gap-3">
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
            dimmed ? "bg-slate-800 text-slate-500" : "bg-blue-600/25 text-blue-300 ring-1 ring-blue-500/30"
          }`}
        >
          <Fish size={22} aria-hidden />
        </div>
        <div className="min-w-0 flex-1 pr-2">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="truncate text-lg font-bold text-white">{name}</h3>
            {isOnline ? <Badge variant="online">Online</Badge> : <Badge variant="offline">Offline</Badge>}
          </div>
          <p className="mt-1 truncate text-sm text-slate-400">{detailParts.join(" · ")}</p>
          {note ? <p className="mt-2 line-clamp-2 text-xs text-slate-500">{note}</p> : null}
        </div>
      </div>

      {isOnline ? (
        <div className="mt-6 grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-[#1e293b] bg-[#0f172a] p-3">
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-500">
              <Thermometer size={14} className="text-orange-300" aria-hidden />
              Teplota
            </div>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-2xl font-bold tabular-nums text-white">
                {tempNum != null ? tempNum.toFixed(1) : "—"}
              </span>
              <span className="text-xs text-slate-500">°C</span>
            </div>
            <SegmentBar valuePct={tempPct} tone={salinityWarning ? "warning" : "blue"} />
          </div>

          <div className="rounded-xl border border-[#1e293b] bg-[#0f172a] p-3">
            <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Salinita</div>
            <div className="mt-2 flex items-baseline gap-1">
              <span
                className={`text-2xl font-bold tabular-nums ${
                  salinityWarning ? "text-amber-400" : "text-white"
                }`}
              >
                {marine ? (salinityNum != null ? salinityNum.toFixed(1) : "—") : "—"}
              </span>
              <span className="text-xs text-slate-500">{marine ? "ppt" : "n/a"}</span>
            </div>
            <SegmentBar
              valuePct={marine ? saltPct : 0}
              tone={salinityWarning ? "warning" : "blue"}
            />
          </div>
        </div>
      ) : (
        <div className="mt-6 rounded-xl border border-red-900/50 bg-red-950/35 px-4 py-3 text-sm text-red-200">
          Zařízení nereaguje. Zkontrolujte připojení.
        </div>
      )}
    </article>
  );
};

export default AquariumCard;
