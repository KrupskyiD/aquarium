/* eslint-disable react-refresh/only-export-components -- context module exports hook + provider */
import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AUTH_SESSION_STORAGE_KEY = "saltguard.auth.session";

const parseStoredSession = () => {
  try {
    const raw = localStorage.getItem(AUTH_SESSION_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const AuthSessionContext = createContext(null);

export const AuthSessionProvider = ({ children }) => {
  const [authSession, setAuthSession] = useState(() => parseStoredSession());

  useEffect(() => {
    if (authSession) {
      localStorage.setItem(AUTH_SESSION_STORAGE_KEY, JSON.stringify(authSession));
      return;
    }
    localStorage.removeItem(AUTH_SESSION_STORAGE_KEY);
  }, [authSession]);

  const value = useMemo(
    () => ({
      authSession,
      setAuthSession,
      logout: () => setAuthSession(null),
    }),
    [authSession],
  );

  return (
    <AuthSessionContext.Provider value={value}>{children}</AuthSessionContext.Provider>
  );
};

export const useAuthSession = () => {
  const ctx = useContext(AuthSessionContext);
  if (!ctx) {
    throw new Error("useAuthSession must be used within AuthSessionProvider");
  }
  return ctx;
};
