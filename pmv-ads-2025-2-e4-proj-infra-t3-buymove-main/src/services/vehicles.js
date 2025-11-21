import { api, useMocks } from "./api";
import vehiclesMock from "@/mocks/vehicles.json";

const LOCAL_VEHICLES_KEY = "bm_vehicle_list";
const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1493238792000-8113da705763?auto=format&fit=crop&w=900&q=80";

function delay(ms) {
  return new Promise((res) => setTimeout(res, ms));
}

function normalizeNumber(value, fallback = 0) {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : fallback;
}

function loadLocalVehicles() {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(LOCAL_VEHICLES_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.warn("Erro ao ler lista de veículos salvos", err);
    return [];
  }
}

function persistLocalVehicles(list) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LOCAL_VEHICLES_KEY, JSON.stringify(list));
  } catch (error) {
    console.warn("Não foi possível salvar veículos locais.", error);
  }
}

function saveLocalVehicle(vehicle) {
  if (!vehicle) return;
  const current = loadLocalVehicles().filter(
    (item) => String(item.id) !== String(vehicle.id)
  );
  persistLocalVehicles([...current, vehicle]);
}

function removeLocalVehicle(id) {
  const filtered = loadLocalVehicles().filter(
    (item) => String(item.id) !== String(id)
  );
  persistLocalVehicles(filtered);
}

function combineVehicles() {
  const locals = loadLocalVehicles();
  return [...locals, ...vehiclesMock];
}

function applyFilters(list = [], params = {}) {
  const {
    q = "",
    brand = "",
    minPrice = 0,
    maxPrice = Number.MAX_SAFE_INTEGER,
    page = 1,
    pageSize = 12,
    color = "",
    doors = "",
    location = "",
  } = params;

  const filtered = list
    .map(normalizeVehicle)
    .filter((v) => {
      const price = normalizeNumber(v.price, 0);
      return price >= minPrice && price <= maxPrice;
    })
    .filter((v) => !brand || v.brand?.toLowerCase().includes(brand.toLowerCase()))
    .filter((v) => !q || `${v.title} ${v.description}`.toLowerCase().includes(q.toLowerCase()))
    .filter((v) => !color || v.color?.toLowerCase().includes(color.toLowerCase()))
    .filter((v) => !doors || String(v.doors) === String(doors))
    .filter((v) => !location || v.location?.toLowerCase().includes(location.toLowerCase()));

  const total = filtered.length;
  const start = (page - 1) * pageSize;
  const items = filtered.slice(start, start + pageSize);

  return { items, total };
}

export function normalizeVehicle(raw) {
  if (!raw) return null;
  const imageUrl = raw.imageUrl || raw.images?.[0] || PLACEHOLDER_IMAGE;
  return {
    ...raw,
    id: raw.id || raw._id || raw.vehicle_id || raw._id?.toString?.() || raw.id?.toString?.(),
    imageUrl,
    images: raw.images?.length ? raw.images : [imageUrl].filter(Boolean),
    brand: raw.brand || raw.marca || "",
    mileage: normalizeNumber(raw.mileage ?? raw.km, 0),
    price: normalizeNumber(raw.price, 0),
  };
}

export async function listVehicles(params = {}) {
  if (useMocks) {
    await delay(300);
    return applyFilters(combineVehicles(), params);
  }

  const hasValue = (value) =>
    value !== undefined && value !== null && value !== "" && !Number.isNaN(value);

  const parsePositiveNumber = (value) => {
    if (!hasValue(value)) return undefined;
    const numeric = Number(value);
    return Number.isFinite(numeric) && numeric > 0 ? numeric : undefined;
  };

  const doors = parsePositiveNumber(params.doors);
  const minPrice = parsePositiveNumber(params.minPrice);
  const maxPrice = parsePositiveNumber(params.maxPrice);

  const queryParams = {
    q: params.q || undefined,
    brand: params.brand || undefined,
    color: params.color || undefined,
    doors: Number.isFinite(doors) ? doors : undefined,
    location: params.location || undefined,
    min_price: Number.isFinite(minPrice) ? minPrice : undefined,
    max_price: Number.isFinite(maxPrice) ? maxPrice : undefined,
    page: params.page ?? 1,
    page_size: params.pageSize ?? 12,
  };

  const res = await api.get("/vehicles", {
    params: queryParams,
  });
  const serverItems = Array.isArray(res.data.items) ? res.data.items : [];
  const localItems = loadLocalVehicles();

  const { items, total } = applyFilters(
    [...localItems, ...serverItems],
    {
      ...params,
      page: params.page ?? 1,
      pageSize: params.pageSize ?? 12,
    }
  );

  return { items, total: res.data?.total ?? total };
}

export async function listUserVehicles(params = {}) {
  if (useMocks) {
    const locals = loadLocalVehicles().map(normalizeVehicle);
    return { items: locals, total: locals.length };
  }

  const res = await api.get("/vehicles/me", {
    params: {
      page: params.page ?? 1,
      page_size: params.pageSize ?? 50,
    },
  });
  const items = Array.isArray(res.data.items)
    ? res.data.items.map(normalizeVehicle)
    : [];
  return { items, total: res.data.total ?? items.length };
}

export async function getVehicleById(id) {
  if (useMocks) {
    await delay(200);
    const localMatch = loadLocalVehicles().find((v) => String(v.id) === String(id));
    if (localMatch) return normalizeVehicle(localMatch);
    const mockMatch = vehiclesMock.find((v) => String(v.id) === String(id));
    return normalizeVehicle(mockMatch);
  }

  const res = await api.get(`/vehicles/${id}`);
  return normalizeVehicle(res.data);
}

export async function createVehicle(payload) {
  if (useMocks) {
    const newVehicle = normalizeVehicle({
      ...payload,
      id: crypto.randomUUID(),
    });
    const merged = [...loadLocalVehicles(), newVehicle];
    persistLocalVehicles(merged);
    return newVehicle;
  }

  const res = await api.post("/vehicles", payload);
  const created = normalizeVehicle(res.data);
  saveLocalVehicle(created);
  return created;
}

export async function updateVehicle(id, payload) {
  if (useMocks) {
    const current = loadLocalVehicles();
    const updated = current.map((item) =>
      String(item.id) === String(id) ? normalizeVehicle({ ...item, ...payload }) : item
    );
    persistLocalVehicles(updated);
    return normalizeVehicle(updated.find((v) => String(v.id) === String(id)));
  }

  const res = await api.patch(`/vehicles/${id}`, payload);
  const updated = normalizeVehicle(res.data);
  saveLocalVehicle(updated);
  return updated;
}

export async function deleteVehicle(id) {
  if (useMocks) {
    const filtered = loadLocalVehicles().filter((item) => String(item.id) !== String(id));
    persistLocalVehicles(filtered);
    return;
  }

  await api.delete(`/vehicles/${id}`);
  removeLocalVehicle(id);
}

export async function getRecommendations(baseId) {
  if (useMocks) {
    await delay(200);
    const all = combineVehicles().map(normalizeVehicle);
    const base = all.find((v) => String(v.id) === String(baseId));
    if (!base) return [];
    return all
      .filter((v) => v.id !== base.id)
      .sort(
        (a, b) =>
          Math.abs(normalizeNumber(a.price) - normalizeNumber(base.price)) -
          Math.abs(normalizeNumber(b.price) - normalizeNumber(base.price))
      )
      .slice(0, 6);
  }

  const res = await api.get(`/vehicles/${baseId}/recommendations`);
  return Array.isArray(res.data) ? res.data.map(normalizeVehicle) : [];
}
