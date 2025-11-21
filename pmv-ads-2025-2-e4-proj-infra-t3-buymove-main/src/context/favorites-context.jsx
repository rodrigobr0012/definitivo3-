import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { addFavorite, listFavorites, removeFavorite } from "@/services/favorites";
import { normalizeVehicle } from "@/services/vehicles";
import { useAuth } from "@/context/auth-context";
import { useMocks } from "@/services/api";

const FavoritesContext = createContext(null);
const STORAGE_KEY = "bm_favorites";

function readStoredFavorites() {
  if (typeof window === "undefined") return [];

  try {
    const storedValue = window.localStorage.getItem(STORAGE_KEY);
    if (!storedValue) return [];
    const parsed = JSON.parse(storedValue);
    return Array.isArray(parsed) ? parsed.map(normalizeVehicle) : [];
  } catch (error) {
    console.warn("Não foi possível carregar favoritos do armazenamento local.", error);
    return [];
  }
}

export function FavoritesProvider({ children }) {
  const { user } = useAuth();
  const shouldUseRemote = !useMocks && Boolean(user);
  const [favorites, setFavorites] = useState(() => readStoredFavorites());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    } catch (err) {
      console.warn("Não foi possível salvar favoritos no armazenamento local.", err);
    }
  }, [favorites]);

  useEffect(() => {
    if (!shouldUseRemote) return;

    setLoading(true);
    listFavorites()
      .then((items) => setFavorites(items))
      .catch((err) => setError(err instanceof Error ? err.message : String(err)))
      .finally(() => setLoading(false));
  }, [shouldUseRemote]);

  const toggleFavorite = useCallback(
    async (vehicle) => {
      if (!vehicle?.id) return;

      if (shouldUseRemote) {
        const exists = favorites.some((item) => item.id === vehicle.id);
        try {
          if (exists) {
            await removeFavorite(vehicle.id);
            setFavorites((prev) => prev.filter((item) => item.id !== vehicle.id));
          } else {
            const created = await addFavorite(vehicle.id);
            const nextVehicle = normalizeVehicle(created || vehicle);
            setFavorites((prev) => [...prev.filter((item) => item.id !== vehicle.id), nextVehicle]);
          }
        } catch (err) {
          setError(err instanceof Error ? err.message : String(err));
        }
        return;
      }

      setFavorites((prev) => {
        const exists = prev.find((item) => item.id === vehicle.id);
        if (exists) {
          return prev.filter((item) => item.id !== vehicle.id);
        }

        return [...prev, normalizeVehicle(vehicle)];
      });
    },
    [favorites, shouldUseRemote]
  );

  const removeFavoriteById = useCallback(
    async (id) => {
      if (shouldUseRemote) {
        try {
          await removeFavorite(id);
          setFavorites((prev) => prev.filter((item) => item.id !== id));
        } catch (err) {
          setError(err instanceof Error ? err.message : String(err));
        }
        return;
      }

      setFavorites((prev) => prev.filter((item) => item.id !== id));
    },
    [shouldUseRemote]
  );

  const updateFavorite = useCallback((id, patch) => {
    setFavorites((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...patch } : item))
    );
  }, []);

  const value = useMemo(
    () => ({ favorites, toggleFavorite, removeFavorite: removeFavoriteById, updateFavorite, loading, error }),
    [favorites, toggleFavorite, removeFavoriteById, updateFavorite, loading, error]
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() {
  const context = useContext(FavoritesContext);

  if (!context) {
    throw new Error("useFavorites deve ser utilizado dentro de FavoritesProvider");
  }

  return context;
}
