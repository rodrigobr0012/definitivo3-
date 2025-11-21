import { api, useMocks } from "./api";
import { normalizeVehicle } from "./vehicles";

const LOCAL_FAVORITES_KEY = "bm_favorites";

function readLocalFavorites() {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LOCAL_FAVORITES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.warn("Falha ao ler favoritos locais", error);
    return [];
  }
}

function persistLocalFavorites(list) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LOCAL_FAVORITES_KEY, JSON.stringify(list));
  } catch (error) {
    console.warn("Não foi possível salvar favoritos locais", error);
  }
}

export async function listFavorites() {
  if (useMocks) {
    return readLocalFavorites().map(normalizeVehicle);
  }

  const response = await api.get("/favorites");
  return Array.isArray(response.data)
    ? response.data
        .map((fav) => ({ ...normalizeVehicle(fav.vehicle), favoriteId: fav.id }))
        .filter(Boolean)
    : [];
}

export async function addFavorite(vehicleId) {
  if (useMocks) {
    const current = readLocalFavorites();
    if (current.some((item) => String(item.id) === String(vehicleId))) return current;
    const next = [...current, { id: vehicleId }];
    persistLocalFavorites(next);
    return next.map(normalizeVehicle);
  }

  const response = await api.post("/favorites", { vehicle_id: vehicleId });
  return { ...normalizeVehicle(response.data.vehicle), favoriteId: response.data.id };
}

export async function removeFavorite(vehicleId) {
  if (useMocks) {
    const remaining = readLocalFavorites().filter((item) => String(item.id) !== String(vehicleId));
    persistLocalFavorites(remaining);
    return remaining.map(normalizeVehicle);
  }

  await api.delete(`/favorites/${vehicleId}`);
}
