export const normalizeAquarium = (raw) => {
  if (!raw) return raw;

  const liters = raw.liters ?? raw.volume ?? null;
  const parsedVolume =
    liters != null && Number.isFinite(Number(liters)) ? Number(liters) : null;

  return {
    ...raw,
    liters: parsedVolume,
    volume: parsedVolume,
    type: raw.aquarium_type ?? raw.type ?? "marine",
    aquarium_type: raw.aquarium_type ?? raw.type ?? "marine",
  };
};

export const formatAquariumVolume = (aquarium) => {
  const volume = aquarium?.volume ?? aquarium?.liters;
  if (volume != null && Number.isFinite(Number(volume)) && Number(volume) > 0) {
    return `${Number(volume)} L`;
  }
  return null;
};

export const formatAquariumSubtitle = (aquarium) => {
  const typeLabel = (aquarium?.type ?? aquarium?.aquarium_type) === "marine" ? "Mořské" : "Sladkovodní";
  const volumePart = formatAquariumVolume(aquarium);
  return volumePart ? `${typeLabel} • ${volumePart}` : typeLabel;
};
