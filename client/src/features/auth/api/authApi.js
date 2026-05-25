import { authenticatedFetch } from "../../../shared/api/authenticatedFetch.js";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

const buildUrl = (path) => `${API_BASE_URL}${path}`;

const parseJsonSafely = async (response) => {
  try {
    return await response.json();
  } catch {
    return null;
  }
};

const request = async (path, options = {}) => {
  const response = await fetch(buildUrl(path), options);
  const payload = await parseJsonSafely(response);

  if (!response.ok) {
    const error = new Error(payload?.message || "Požadavek selhal");
    error.status = response.status;
    error.payload = payload;
    throw error;
  }

  return payload;
};

export const registerAuth = ({ name, email, password }) =>
  request("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });

export const loginAuth = ({ email, password }) =>
  request("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

export const resendVerificationEmail = (email) =>
  request("/api/auth/resend-verification", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

export const verifyEmailToken = (token) =>
  request(`/api/auth/verify?token=${encodeURIComponent(token)}`, {
    method: "GET",
  });

export const logoutAuth = async (accessToken) => {
  const { payload } = await authenticatedFetch("/api/auth/logout", accessToken, {
    method: "POST",
  });
  return payload;
};

export const fetchMeAuth = async (accessToken) => {
  const { payload } = await authenticatedFetch("/api/auth/me", accessToken, {
    method: "GET",
  });
  return payload;
};

export const updateProfileAuth = async (accessToken, { name, email }) => {
  const { payload } = await authenticatedFetch("/api/auth/profile", accessToken, {
    method: "PATCH",
    body: JSON.stringify({ name, email }),
  });
  return payload;
};

export const changePasswordAuth = async (accessToken, { currentPassword, newPassword }) => {
  const { payload } = await authenticatedFetch("/api/auth/password", accessToken, {
    method: "PATCH",
    body: JSON.stringify({ currentPassword, newPassword }),
  });
  return payload;
};
