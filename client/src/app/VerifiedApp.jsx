import { useCallback, useEffect, useMemo, useState } from "react";
import { Navigate, Outlet, useNavigate, useSearchParams } from "react-router-dom";
import { useAuthSession } from "./AuthSessionContext";
import {
  fetchAquariums,
  fetchAquariumById,
  createAquarium,
  updateAquarium,
  deleteAquarium,
} from "../features/aquarium/api/aquariumApi";
import { fetchMeAuth } from "../features/auth/api/authApi";

const idKey = (id) => String(id);
const toDetailPath = (aquariumId) =>
  `/aquarium/detail?aquariumId=${encodeURIComponent(idKey(aquariumId))}`;

const VerifiedApp = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { authSession, setAuthSession, logout } = useAuthSession();

  const accessToken = authSession?.accessToken;

  const [aquariums, setAquariums] = useState([]);
  const [aquariumsLoading, setAquariumsLoading] = useState(false);
  const [selectedAquarium, setSelectedAquarium] = useState(null);

  const aquariumIdFromUrl = searchParams.get("aquariumId");

  useEffect(() => {
    if (!accessToken) return;

    let cancelled = false;
    (async () => {
      try {
        const payload = await fetchMeAuth(accessToken);
        const user = payload?.data?.user;
        if (!user || cancelled) return;
        setAuthSession((prev) => (prev ? { ...prev, user } : prev));
      } catch {
        // Session may be expired; keep existing user snapshot.
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [accessToken, setAuthSession]);

  const loadAquariums = useCallback(async () => {
    if (!accessToken) return;
    setAquariumsLoading(true);
    try {
      const list = await fetchAquariums(accessToken);
      setAquariums(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error(err);
      setAquariums([]);
    } finally {
      setAquariumsLoading(false);
    }
  }, [accessToken]);

  useEffect(() => {
    const timer = setTimeout(() => {
      void loadAquariums();
    }, 0);
    return () => {
      clearTimeout(timer);
    };
  }, [loadAquariums]);

  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(() => {
      if (!aquariumIdFromUrl) {
        setSelectedAquarium(null);
        return;
      }

      const match = aquariums.find((a) => idKey(a.id) === idKey(aquariumIdFromUrl));
      if (match) {
        setSelectedAquarium(match);
        return;
      }

      if (!accessToken) return;

      (async () => {
        try {
          const fresh = await fetchAquariumById(accessToken, aquariumIdFromUrl);
          if (!cancelled) setSelectedAquarium(fresh ?? null);
        } catch (err) {
          console.error(err);
          if (!cancelled) setSelectedAquarium(null);
        }
      })();
    }, 0);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [accessToken, aquariumIdFromUrl, aquariums]);

  const handleLogout = useCallback(() => {
    logout();
    navigate("/login", { replace: true });
  }, [logout, navigate]);

  const handleAddAquarium = useCallback(
    async (formData) => {
      if (!accessToken) return;
      try {
        await createAquarium(accessToken, {
          name: formData.name.trim(),
          volume: formData.volume,
          type: formData.type,
          device_serial: formData.device_number.trim(),
        });
        await loadAquariums();
      } catch (err) {
        console.error(err);
      }
    },
    [accessToken, loadAquariums],
  );

  const handleSaveAquarium = useCallback(
    async ({ id, name, volume, type }) => {
      if (!accessToken) return;
      try {
        const updated = await updateAquarium(accessToken, id, {
          name,
          volume,
          type,
        });
        if (updated) {
          setAquariums((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
          setSelectedAquarium((prev) => (prev && prev.id === updated.id ? updated : prev));
        }
        if (!id) return;
        navigate(toDetailPath(id));
      } catch (err) {
        console.error(err);
      }
    },
    [accessToken, navigate],
  );

  const handleDeleteAquarium = useCallback(
    async (aquariumId) => {
      if (!accessToken) return;
      try {
        await deleteAquarium(accessToken, aquariumId);
        setAquariums((prev) => prev.filter((a) => a.id !== aquariumId));
        setSelectedAquarium(null);
        navigate("/aquarium", { replace: true });
      } catch (err) {
        console.error(err);
      }
    },
    [accessToken, navigate],
  );

  const openAquariumDetail = useCallback(
    async (aquarium) => {
      if (!aquarium?.id) return;
      if (!accessToken) {
        setSelectedAquarium(aquarium);
        navigate(toDetailPath(aquarium.id));
        return;
      }
      try {
        const fresh = await fetchAquariumById(accessToken, aquarium.id);
        setSelectedAquarium(fresh ?? aquarium);
      } catch (err) {
        console.error(err);
        setSelectedAquarium(aquarium);
      }
      navigate(toDetailPath(aquarium.id));
    },
    [accessToken, navigate],
  );

  const outletContext = useMemo(
    () => ({
      authUser: authSession?.user,
      accessToken,
      aquariums,
      aquariumsLoading,
      selectedAquarium,
      setAuthSession,
      onLogout: handleLogout,
      onAddAquarium: handleAddAquarium,
      onOpenAquariumDetail: openAquariumDetail,
      onSaveAquarium: handleSaveAquarium,
      onDeleteAquarium: handleDeleteAquarium,
    }),
    [
      accessToken,
      aquariums,
      aquariumsLoading,
      authSession?.user,
      handleAddAquarium,
      handleDeleteAquarium,
      handleLogout,
      handleSaveAquarium,
      openAquariumDetail,
      selectedAquarium,
      setAuthSession,
    ],
  );

  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet context={outletContext} />;
};

export default VerifiedApp;
