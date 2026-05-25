const emptyStatus = { text: "—", difference: 0 };

export const resolveAquariumLiveMetrics = (aquarium, liveMetrics) => {
  const latest = aquarium?.metrics?.[0];
  const hasLivePayload =
    liveMetrics != null &&
    liveMetrics.device_serial != null &&
    liveMetrics.temp != null;

  const isThisDevice =
    hasLivePayload &&
    aquarium?.device_serial != null &&
    liveMetrics.device_serial === aquarium.device_serial;

  const salinityNum = isThisDevice
    ? Number(liveMetrics.salt)
    : latest?.salinity != null
      ? Number(latest.salinity)
      : null;

  const tempNum = isThisDevice
    ? Number(liveMetrics.temp)
    : latest?.temperature != null
      ? Number(latest.temperature)
      : null;

  const limits = isThisDevice
    ? liveMetrics.limits
    : {
        salt: Number.isFinite(salinityNum) ? { text: "v normě", difference: 0 } : emptyStatus,
        temp: Number.isFinite(tempNum) ? { text: "v normě", difference: 0 } : emptyStatus,
      };

  return {
    isThisDevice,
    salinityNum: Number.isFinite(salinityNum) ? salinityNum : null,
    tempNum: Number.isFinite(tempNum) ? tempNum : null,
    limits,
  };
};
