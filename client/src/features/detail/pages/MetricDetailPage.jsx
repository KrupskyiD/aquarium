import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import DesktopAppLayout from "../../../shared/components/DesktopAppLayout";
import { SCREENS } from "../../../shared/constants/screens";

const RANGE_OPTIONS = [
  { id: "24h", label: "24h" },
  { id: "7d", label: "7 dní" },
  { id: "30d", label: "30 dní" },
];

const METRIC_CONFIG = {
  salinity: {
    title: "Salinita",
    unit: "ppt",
    valueColor: "text-slate-100",
    accentColor: "#3B82F6",
    gradientId: "detailSalinityGradient",
    target: 35,
    trendLabel: "▼ 0.2",
    trendClasses:
      "border border-orange-500/30 bg-orange-500/15 text-orange-300",
    data: {
      "24h": [
        { label: "00:00", value: 34.5 },
        { label: "04:00", value: 34.4 },
        { label: "08:00", value: 34.9 },
        { label: "12:00", value: 34.6 },
        { label: "16:00", value: 35.0 },
        { label: "20:00", value: 34.8 },
        { label: "24:00", value: 34.8 },
      ],
      "7d": [
        { label: "Po", value: 34.6 },
        { label: "Út", value: 34.7 },
        { label: "St", value: 34.5 },
        { label: "Čt", value: 34.8 },
        { label: "Pá", value: 34.9 },
        { label: "So", value: 34.7 },
        { label: "Ne", value: 34.8 },
      ],
      "30d": [
        { label: "1", value: 34.5 },
        { label: "5", value: 34.8 },
        { label: "10", value: 34.7 },
        { label: "15", value: 34.6 },
        { label: "20", value: 34.9 },
        { label: "25", value: 34.8 },
        { label: "30", value: 34.8 },
      ],
    },
  },
  temperature: {
    title: "Teplota",
    unit: "°C",
    valueColor: "text-amber-400",
    accentColor: "#F59E0B",
    gradientId: "detailTemperatureGradient",
    target: 25,
    trendLabel: "▲ +0.1",
    trendClasses:
      "border border-emerald-500/30 bg-emerald-500/15 text-emerald-300",
    data: {
      "24h": [
        { label: "00:00", value: 25.2 },
        { label: "04:00", value: 25.1 },
        { label: "08:00", value: 25.3 },
        { label: "12:00", value: 25.4 },
        { label: "16:00", value: 25.2 },
        { label: "20:00", value: 25.5 },
        { label: "24:00", value: 25.4 },
      ],
      "7d": [
        { label: "Po", value: 25.0 },
        { label: "Út", value: 25.2 },
        { label: "St", value: 25.1 },
        { label: "Čt", value: 25.3 },
        { label: "Pá", value: 25.4 },
        { label: "So", value: 25.2 },
        { label: "Ne", value: 25.4 },
      ],
      "30d": [
        { label: "1", value: 25.1 },
        { label: "5", value: 25.2 },
        { label: "10", value: 25.0 },
        { label: "15", value: 25.3 },
        { label: "20", value: 25.4 },
        { label: "25", value: 25.3 },
        { label: "30", value: 25.4 },
      ],
    },
  },
};

const TOOLTIP_WIDTH = 130;

const MetricTooltip = ({ active, payload, coordinate, viewBox, unit }) => {
  if (!active || !payload?.length) return null;

  const pointX = coordinate?.x ?? 0;
  const chartLeft = viewBox?.x ?? 0;
  const chartWidth = viewBox?.width ?? 0;
  const rightEdge = chartLeft + chartWidth;

  const shouldFlipLeft = pointX + TOOLTIP_WIDTH > rightEdge - 8;
  const shouldPushRight = pointX < chartLeft + 8;

  let xTranslateClass = "-translate-x-1/2";
  if (shouldFlipLeft) xTranslateClass = "-translate-x-full -translate-x-2";
  if (shouldPushRight) xTranslateClass = "translate-x-2";

  const value = Number(payload[0]?.value ?? 0).toFixed(1);
  const label = payload[0]?.payload?.label ?? "";

  return (
    <div
      className={`rounded-md border border-slate-600/70 bg-[#071322]/95 px-2.5 py-1.5 text-xs font-medium text-slate-100 shadow-lg backdrop-blur-sm ${xTranslateClass}`}
    >
      {label} • {value} {unit}
    </div>
  );
};

const formatNumber = (num) => Number(num).toFixed(1);

const MetricDetailPage = ({ aquarium, metricType = "salinity", onNavigate }) => {
  const [selectedRange, setSelectedRange] = useState("24h");
  const config = METRIC_CONFIG[metricType] ?? METRIC_CONFIG.salinity;
  const data = config.data[selectedRange];

  const stats = useMemo(() => {
    const values = data.map((item) => item.value);
    const max = Math.max(...values);
    const min = Math.min(...values);
    const avg = values.reduce((sum, current) => sum + current, 0) / values.length;
    return { max, min, avg };
  }, [data]);

  const currentValue =
    metricType === "temperature"
      ? Number(aquarium?.temperature ?? data[data.length - 1].value)
      : Number(aquarium?.salinity ?? data[data.length - 1].value);

  const content = (
    <div className="mx-auto flex w-full max-w-[740px] flex-col gap-5">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onNavigate(SCREENS.DETAIL)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-700/50 bg-[#121A21]"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <h1 className="text-3xl font-bold md:text-4xl">{config.title}</h1>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-700/50 bg-[#0C1A28] p-4 md:p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
          AKTUÁLNÍ HODNOTA
        </p>
        <div className="mt-2 flex items-center justify-between gap-3">
          <div className="flex items-baseline gap-2">
            <span className={`text-5xl font-light tracking-tight ${config.valueColor}`}>
              {formatNumber(currentValue)}
            </span>
            <span className="text-3xl text-slate-400">{config.unit}</span>
          </div>
          <div className={`rounded-full px-3 py-1 text-base font-semibold ${config.trendClasses}`}>
            {config.trendLabel}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 rounded-2xl border border-slate-700/50 bg-[#0C1A28] p-1.5">
        {RANGE_OPTIONS.map((range) => {
          const isActive = range.id === selectedRange;
          return (
            <button
              key={range.id}
              type="button"
              onClick={() => setSelectedRange(range.id)}
              className={`rounded-xl px-3 py-2 text-sm font-semibold transition-colors ${
                isActive
                  ? "bg-[#3b82f6] text-white"
                  : "bg-[#0f1c2e] text-slate-400 hover:text-slate-300"
              }`}
            >
              {range.label}
            </button>
          );
        })}
      </div>

      <div className="rounded-2xl border border-slate-700/50 bg-[#0C1A28] p-4">
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 22, right: 12, left: 12, bottom: 8 }}
            >
              <defs>
                <linearGradient id={config.gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={config.accentColor} stopOpacity={0.4} />
                  <stop offset="95%" stopColor={config.accentColor} stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="label"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#51607a", fontSize: 12 }}
              />
              <YAxis hide domain={["dataMin - 0.3", "dataMax + 0.3"]} />
              <ReferenceLine
                y={config.target}
                stroke="#22d3ee"
                strokeOpacity={0.45}
                strokeDasharray="4 4"
                label={{
                  value: `Cíl ${config.target} ${config.unit}`,
                  position: "insideTopRight",
                  fill: "#67e8f9",
                  fontSize: 12,
                }}
              />
              <Tooltip
                content={(props) => <MetricTooltip {...props} unit={config.unit} />}
                cursor={{ stroke: "#7fb2ff", strokeWidth: 1, strokeOpacity: 0.8 }}
                offset={20}
                allowEscapeViewBox={{ x: false, y: true }}
                wrapperStyle={{ zIndex: 40, pointerEvents: "none" }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke={config.accentColor}
                strokeWidth={3}
                fillOpacity={1}
                fill={`url(#${config.gradientId})`}
                dot={false}
                activeDot={{ r: 5, stroke: config.accentColor, strokeWidth: 2, fill: "#0a1524" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl border border-slate-700/50 bg-[#0C1A28] p-4 text-center">
          <p className={`text-3xl font-semibold ${config.valueColor}`}>{formatNumber(stats.max)}</p>
          <p className="mt-1 text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">MAX</p>
        </div>
        <div className="rounded-xl border border-slate-700/50 bg-[#0C1A28] p-4 text-center">
          <p className="text-3xl font-semibold text-slate-100">{formatNumber(stats.min)}</p>
          <p className="mt-1 text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">MIN</p>
        </div>
        <div className="rounded-xl border border-slate-700/50 bg-[#0C1A28] p-4 text-center">
          <p className="text-3xl font-semibold text-slate-100">{formatNumber(stats.avg)}</p>
          <p className="mt-1 text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">PRŮMĚR</p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <section className="min-h-screen bg-[#0B1120] px-5 pb-20 pt-8 text-white md:hidden">
        {content}
      </section>

      <div className="hidden md:block">
        <DesktopAppLayout
          title={`Detail ${config.title.toLowerCase()}`}
          activeScreen={SCREENS.DETAIL}
          onNavigate={onNavigate}
        >
          {content}
        </DesktopAppLayout>
      </div>
    </>
  );
};

export default MetricDetailPage;
