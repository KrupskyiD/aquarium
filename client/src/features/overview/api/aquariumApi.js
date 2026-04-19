const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

const authHeader = (token) => ({
  Authorization: `Bearer ${token}`,
  "Content-Type": "application/json",
});

/**
 * GET /api/aquariums — list current user's aquariums (requires JWT).
 */
export const getAquariums = async (accessToken) => {
  const res = await fetch(`${API_BASE_URL}/api/aquariums`, {
    headers: authHeader(accessToken),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(body?.message || "Nepodařilo se načíst akvária");
    err.status = res.status;
    throw err;
  }
  return body;
};

/**
 * POST /api/aquariums — create aquarium (requires JWT).
 */


export const postAquarium = async (accessToken, payload) => {
  const res = await fetch(`${API_BASE_URL}/api/aquariums`, {
    method: "POST",
    headers: authHeader(accessToken),
    body: JSON.stringify(payload),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(body?.message || "Uložení se nezdařilo");
    err.status = res.status;
    throw err;
  }
  return body;
};
