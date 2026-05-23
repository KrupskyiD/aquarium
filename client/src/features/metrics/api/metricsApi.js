import { authenticatedFetch } from "../../../shared/api/authenticatedFetch.js";

export const fetchAquariumMetrics = async (
  accessToken,
  aquariumId,
  { from, to, sensor },
) => {
  const params = new URLSearchParams({ from, to, sensor });
  const { payload } = await authenticatedFetch(
    `/api/aquarium/${aquariumId}/metrics?${params}`,
    accessToken,
    { method: "GET" },
  );

  return payload?.data ?? null;
};
