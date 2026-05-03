const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

const buildUrl = (path) => `${API_BASE_URL}${path}`;

const parseJsonSafely = async (response) => {
  try {
    return await response.json();
  } catch {
    return null;
  }
};

const authHeaders = (accessToken, extra = {}) => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${accessToken}`,
  ...extra,
});

const request = async (path, accessToken, options = {}) => {
  const response = await fetch(buildUrl(path), {
    ...options,
    headers: {
      ...authHeaders(accessToken),
      ...options.headers,
    },
  });
  const payload = await parseJsonSafely(response);

  if (!response.ok) {
    const error = new Error(payload?.message || "Požadavek selhal");
    error.status = response.status;
    error.payload = payload;
    throw error;
  }

  return payload;
};

export const fetchAquariums = async (accessToken) => {
  const payload = await request("/api/aquariums", accessToken, { method: "GET" });
  return payload?.data ?? [];
};

export const fetchAquariumById = async (accessToken, id) => {
  const payload = await request(`/api/aquariums/${id}`, accessToken, { method: "GET" });
  return payload?.data ?? null;
};

export const createAquarium = async (accessToken, body) => {
  const payload = await request("/api/aquariums", accessToken, {
    method: "POST",
    body: JSON.stringify(body),
  });
  return payload?.data ?? null;
};

export const updateAquarium = async (accessToken, id, body) => {
  const payload = await request(`/api/aquariums/${id}`, accessToken, {
    method: "PUT",
    body: JSON.stringify(body),
  });
  return payload?.data ?? null;
};

export const deleteAquarium = async (accessToken, id) => {
  await request(`/api/aquariums/${id}`, accessToken, { method: "DELETE" });
};