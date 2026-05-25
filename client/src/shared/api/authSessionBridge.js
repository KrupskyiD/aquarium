const AUTH_SESSION_STORAGE_KEY = "saltguard.auth.session";

let getSession = () => null;
let setSession = () => {};
let onSessionExpired = () => {};

let refreshPromise = null;

export const registerAuthSessionBridge = ({
  getSession: get,
  setSession: set,
  onSessionExpired: onExpired,
}) => {
  getSession = get ?? getSession;
  setSession = set ?? setSession;
  onSessionExpired = onExpired ?? onSessionExpired;
};

export const readStoredSession = () => {
  try {
    const raw = localStorage.getItem(AUTH_SESSION_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const persistSession = (session) => {
  if (session) {
    localStorage.setItem(AUTH_SESSION_STORAGE_KEY, JSON.stringify(session));
  } else {
    localStorage.removeItem(AUTH_SESSION_STORAGE_KEY);
  }
};

const refreshAccessToken = async (refreshToken) => {
  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";
  const response = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });

  let payload = null;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok) {
    const error = new Error(payload?.message || "Invalid or expired token");
    error.status = response.status;
    throw error;
  }

  return payload?.data?.accessToken ?? null;
};

export const ensureValidAccessToken = async (accessToken) => {
  const session = getSession() ?? readStoredSession();
  const token = accessToken ?? session?.accessToken;
  if (!token) return null;

  return token;
};

export const refreshSessionIfNeeded = async () => {
  const session = getSession() ?? readStoredSession();
  if (!session?.refreshToken) {
    onSessionExpired();
    return null;
  }

  if (!refreshPromise) {
    refreshPromise = refreshAccessToken(session.refreshToken)
      .then((newAccessToken) => {
        if (!newAccessToken) {
          throw new Error("Invalid or expired token");
        }
        const nextSession = { ...session, accessToken: newAccessToken };
        setSession(nextSession);
        persistSession(nextSession);
        return newAccessToken;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  try {
    return await refreshPromise;
  } catch {
    onSessionExpired();
    return null;
  }
};

export const isAuthError = (error, response) => {
  const status = error?.status ?? response?.status;
  const message = String(error?.message ?? "").toLowerCase();
  return (
    status === 401 ||
    message.includes("invalid or expired token") ||
    message.includes("invalid or expired refresh")
  );
};
