import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  RANGE_MODES,
  canShiftForward,
  currentIsoMonth,
  formatPickerAnchorLabel,
  isCurrentPeriod,
  jumpToCurrent,
  shiftPicker,
  todayIsoDate,
} from "../utils/metricDateRange";

const MetricRangePicker = ({
  mode,
  onModeChange,
  pickDate,
  onPickDateChange,
  pickMonth,
  onPickMonthChange,
  loading = false,
}) => {
  const pickerState = { mode, pickDate, pickMonth };
  const anchorLabel = formatPickerAnchorLabel(pickerState);
  const showJumpToToday = !isCurrentPeriod(pickerState);
  const canGoForward = canShiftForward(pickerState);

  const applyState = (next) => {
    onModeChange(next.mode);
    onPickDateChange(next.pickDate);
    onPickMonthChange(next.pickMonth);
  };

  return (
    <div
      className={`rounded-2xl border border-slate-700/50 bg-[#0C1A28] p-3 transition-opacity md:p-4 ${
        loading ? "opacity-70" : ""
      }`}
    >
      <div className="flex gap-1 rounded-lg bg-[#0a1524] p-0.5">
        {RANGE_MODES.map((option) => {
          const isActive = option.id === mode;
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onModeChange(option.id)}
              className={`flex-1 rounded-md py-2 text-sm font-medium transition-colors ${
                isActive ? "bg-[#3b82f6] text-white" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>

      <div className="mt-3 flex items-center gap-1">
        <button
          type="button"
          onClick={() => applyState(shiftPicker({ ...pickerState, direction: -1 }))}
          aria-label="Předchozí"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-400 hover:bg-[#0f1c2e] hover:text-white"
        >
          <ChevronLeft size={18} />
        </button>

        <label className="relative min-w-0 flex-1 cursor-pointer rounded-lg py-2 hover:bg-[#0f1c2e]/60">
          <span className="block truncate px-1 text-center text-sm text-white">{anchorLabel}</span>
          <input
            type={mode === "month" ? "month" : "date"}
            value={mode === "month" ? pickMonth : pickDate}
            max={mode === "month" ? currentIsoMonth() : todayIsoDate()}
            onChange={(event) => {
              const value = event.target.value;
              if (!value) return;
              if (mode === "month") {
                onPickMonthChange(value);
                onPickDateChange(`${value}-01`);
                return;
              }
              onPickDateChange(value);
              onPickMonthChange(value.slice(0, 7));
            }}
            className="absolute inset-0 cursor-pointer opacity-0"
          />
        </label>

        <button
          type="button"
          onClick={() => applyState(shiftPicker({ ...pickerState, direction: 1 }))}
          disabled={!canGoForward}
          aria-label="Další"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-400 hover:bg-[#0f1c2e] hover:text-white disabled:pointer-events-none disabled:opacity-25"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {showJumpToToday ? (
        <button
          type="button"
          onClick={() => applyState(jumpToCurrent(mode))}
          className="mt-1 w-full py-1 text-center text-xs text-blue-400 hover:text-blue-300"
        >
          Dnes
        </button>
      ) : null}
    </div>
  );
};

export default MetricRangePicker;
