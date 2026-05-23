import { ensureValidAccessToken, refreshSessionIfNeeded } from "./authSessionBridge.js";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

const buildUrl = (path) => `${API_BASE_URL}${path}`;

export const parseJsonSafely = async (response) => {
  try {
    return await response.json();
  } catch {
    return null;
  }
};

export const authenticatedFetch = async (path, accessToken, options = {}) => {
  let token = await ensureValidAccessToken(accessToken);
  if (!token) {
    const error = new Error("Nejste přihlášeni");
    error.status = 401;
    throw error;
  }

  const run = async () =>
    fetch(buildUrl(path), {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
    });

  let response = await run();

  if (response.status === 401) {
    const refreshed = await refreshSessionIfNeeded();
    if (!refreshed) {
      const payload = await parseJsonSafely(response);
      const error = new Error(payload?.message || "Invalid or expired token");
      error.status = 401;
      throw error;
    }
    token = refreshed;
    response = await run();
  }

  const payload = await parseJsonSafely(response);

  if (!response.ok) {
    const error = new Error(payload?.message || "Požadavek selhal");
    error.status = response.status;
    error.payload = payload;
    throw error;
  }

  return { response, payload };
};
