import { authenticatedFetch } from "../../../shared/api/authenticatedFetch.js";
import { normalizeAquarium } from "../utils/normalizeAquarium.js";

const request = async (path, accessToken, options = {}) => {
  const { payload } = await authenticatedFetch(path, accessToken, options);
  return payload;
};

export const fetchAquariums = async (accessToken) => {
  const payload = await request("/api/aquariums", accessToken, { method: "GET" });
  const list = payload?.data ?? [];
  return Array.isArray(list) ? list.map(normalizeAquarium) : [];
};

export const fetchAquariumById = async (accessToken, id) => {
  const payload = await request(`/api/aquariums/${id}`, accessToken, { method: "GET" });
  return normalizeAquarium(payload?.data ?? null);
};

export const createAquarium = async (accessToken, body) => {
  const payload = await request("/api/aquariums", accessToken, {
    method: "POST",
    body: JSON.stringify(body),
  });
  return normalizeAquarium(payload?.data ?? null);
};

export const updateAquarium = async (accessToken, id, body) => {
  const payload = await request(`/api/aquariums/${id}`, accessToken, {
    method: "PUT",
    body: JSON.stringify(body),
  });
  return normalizeAquarium(payload?.data ?? null);
};

export const deleteAquarium = async (accessToken, id) => {
  await authenticatedFetch(`/api/aquariums/${id}`, accessToken, { method: "DELETE" });
};
