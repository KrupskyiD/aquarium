/**
 * Map API / Prisma row to UI model for cards and live simulation.
 * Supports canonical API shape ({ type, device_number, status }) and legacy Prisma fields.
 * @param {object} row - record from GET /api/aquariums or POST response
 */
export const mapAquariumRowToUi = (row) => {
  const type =
    row.type === "freshwater" || row.water_type === "freshwater"
      ? "freshwater"
      : "marine";

  const deviceAddress =
    row.device_number ?? row.device_serial ?? row.deviceAddress ?? "";

  const isOnline =
    row.status === "online" || row.connection_status === "online";

  const { baseSalinity, baseTemperature } = telemetryBasesFromId(row.id);
  const warnDemo = row.name && /varování|warn/i.test(row.name);
  const salinityBase =
    warnDemo && type === "marine" ? 36.1 + (row.id % 7) * 0.02 : baseSalinity;

  return {
    id: row.id,
    name: row.name,
    volumeLiters: row.volume ?? 0,
    type,
    note: row.notes ?? "",
    deviceAddress,
    isOnline,
    baseSalinity: salinityBase,
    baseTemperature,
  };
};

/**
 * Deterministic “base” telemetry from id so values do not jump on remount.
 */
function telemetryBasesFromId(id) {
  const s = id * 1103515245 + 12345;
  const r1 = ((s >>> 0) % 1000) / 1000;
  const r2 = (((s * 7) >>> 0) % 1000) / 1000;
  return {
    baseSalinity: 33.5 + r1 * 2.5,
    baseTemperature: 24 + r2 * 2,
  };
}
