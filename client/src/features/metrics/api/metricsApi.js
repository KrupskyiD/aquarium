const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

const buildUrl = (path) => `${API_BASE_URL}${path}`;

const parseJsonSafely = async (response) => {
  try {
    return await response.json();
  } catch {
    return null;
  }
};

export const fetchAquariumMetrics = async (
  accessToken,
  aquariumId,
  { period, sensor },
) => {
  const params = new URLSearchParams({ period, sensor });
  const response = await fetch(
    buildUrl(`/api/aquarium/${aquariumId}/metrics?${params}`),
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
  const payload = await parseJsonSafely(response);

  if (!response.ok) {
    const error = new Error(payload?.message || "Požadavek selhal");
    error.status = response.status;
    throw error;
  }

  return payload?.data ?? null;
};
