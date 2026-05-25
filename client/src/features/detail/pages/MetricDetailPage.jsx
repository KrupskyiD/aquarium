import { useContext, useEffect, useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { MetricsContext } from "../../../context/MetricsContext";
import { getToken } from "../../../context/socket";
import { fetchAquariumMetrics } from "../../metrics/api/metricsApi";
import MetricRangePicker from "../components/MetricRangePicker";
import { resolveAquariumLiveMetrics } from "../utils/aquariumLiveMetrics";
import { currentIsoMonth, resolvePickerRange, todayIsoDate } from "../utils/metricDateRange";
import DesktopAppLayout from "../../../shared/components/DesktopAppLayout";
import { SCREENS } from "../../../shared/constants/screens";

const METRIC_CONFIG = {
  salinity: {
    title: "Salinita",
    unit: "ppt",
    valueColor: "text-slate-100",
    accentColor: "#3B82F6",
    gradientId: "detailSalinityGradient",
    target: 35,
    sensor: "salinity",
    liveKey: "salt",
  },
  temperature: {
    title: "Teplota",
    unit: "°C",
    valueColor: "text-amber-400",
    accentColor: "#F59E0B",
    gradientId: "detailTemperatureGradient",
    target: 25,
    sensor: "temperature",
    liveKey: "temp",
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

const formatDisplayValue = (value) =>
  typeof value === "number" && Number.isFinite(value) ? formatNumber(value) : "—";

const computeStatsFromSeries = (series) => {
  const values = series
    .map((item) => Number(item.value))
    .filter((value) => Number.isFinite(value));

  if (values.length === 0) return null;

  return {
    max: Math.max(...values),
    min: Math.min(...values),
    avg: values.reduce((sum, current) => sum + current, 0) / values.length,
  };
};

const hasAnyStat = (stats) =>
  stats &&
  [stats.min, stats.max, stats.avg].some(
    (value) => value != null && Number.isFinite(Number(value)),
  );

const MetricDetailPage = ({ aquarium, metricType = "salinity", onNavigate }) => {
  const { metrics: liveMetrics } = useContext(MetricsContext);
  const [rangeMode, setRangeMode] = useState("week");
  const [pickDate, setPickDate] = useState(todayIsoDate);
  const [pickMonth, setPickMonth] = useState(currentIsoMonth);
  const [chartSeries, setChartSeries] = useState([]);
  const [apiStats, setApiStats] = useState(null);
  const [metricsLoading, setMetricsLoading] = useState(false);

  const config = METRIC_CONFIG[metricType] ?? METRIC_CONFIG.salinity;
  const pickerRange = useMemo(
    () => resolvePickerRange({ mode: rangeMode, pickDate, pickMonth }),
    [rangeMode, pickDate, pickMonth],
  );
  const { isThisDevice, salinityNum, tempNum } = resolveAquariumLiveMetrics(
    aquarium,
    liveMetrics,
  );
  const liveValue =
    config.liveKey === "salt"
      ? salinityNum
      : tempNum;
  const currentValue = isThisDevice && Number.isFinite(liveValue) ? liveValue : null;

  const hasChartData = chartSeries.length > 0;

  const stats = useMemo(() => {
    if (!hasChartData) return null;
    if (hasAnyStat(apiStats)) {
      return {
        max: Number(apiStats.max),
        min: Number(apiStats.min),
        avg: Number(apiStats.avg),
      };
    }
    return computeStatsFromSeries(chartSeries);
  }, [apiStats, chartSeries, hasChartData]);

  const trendLabel = useMemo(() => {
    if (chartSeries.length < 2) return null;
    const delta =
      chartSeries[chartSeries.length - 1].value - chartSeries[chartSeries.length - 2].value;
    if (!Number.isFinite(delta) || Math.abs(delta) < 0.05) return null;
    const sign = delta > 0 ? "▲" : "▼";
    return `${sign} ${Math.abs(delta).toFixed(1)}`;
  }, [chartSeries]);

  const trendClasses =
    trendLabel?.startsWith("▲")
      ? "border border-emerald-500/30 bg-emerald-500/15 text-emerald-300"
      : "border border-orange-500/30 bg-orange-500/15 text-orange-300";

  const emptyPeriodHint = "Za vybrané období nejsou uložená měření.";

  useEffect(() => {
    const aquariumId = aquarium?.id;
    const token = getToken();
    if (!aquariumId || !token) {
      return;
    }

    let cancelled = false;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- clear stale chart when range/aquarium changes
    setChartSeries([]);
    setApiStats(null);
    setMetricsLoading(true);

    fetchAquariumMetrics(token, aquariumId, {
      from: pickerRange.from,
      to: pickerRange.to,
      sensor: config.sensor,
    })
      .then((data) => {
        if (cancelled) return;
        setApiStats(data);
        setChartSeries(
          Array.isArray(data?.series)
            ? data.series.map((point) => ({
                label: point.label,
                value: Number(point.value),
              }))
            : [],
        );
      })
      .catch(() => {
        if (!cancelled) {
          setApiStats(null);
          setChartSeries([]);
        }
      })
      .finally(() => {
        if (!cancelled) setMetricsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [aquarium?.id, pickerRange.from, pickerRange.to, config.sensor]);

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
              {formatDisplayValue(currentValue)}
            </span>
            <span className="text-3xl text-slate-400">{config.unit}</span>
          </div>
          {trendLabel ? (
            <div className={`rounded-full px-3 py-1 text-base font-semibold ${trendClasses}`}>
              {trendLabel}
            </div>
          ) : null}
        </div>
      </div>

      <MetricRangePicker
        mode={rangeMode}
        onModeChange={setRangeMode}
        pickDate={pickDate}
        onPickDateChange={setPickDate}
        pickMonth={pickMonth}
        onPickMonthChange={setPickMonth}
        loading={metricsLoading}
      />

      {metricsLoading ? (
        <div className="h-64 animate-pulse rounded-2xl border border-slate-700/50 bg-[#0C1A28]" />
      ) : hasChartData ? (
        <div className="rounded-2xl border border-slate-700/50 bg-[#0C1A28] p-4">
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartSeries}
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
                  tick={{ fill: "#51607a", fontSize: 11 }}
                  interval="preserveStartEnd"
                  minTickGap={28}
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
      ) : (
        <div className="flex h-64 items-center justify-center rounded-2xl border border-dashed border-slate-700/60 bg-[#0C1A28] px-6 text-center">
          <p className="text-sm text-slate-400">{emptyPeriodHint}</p>
        </div>
      )}

      {!metricsLoading && hasChartData && hasAnyStat(stats) ? (
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
      ) : null}
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
