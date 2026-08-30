const STORAGE_KEY = "roomsync_properties";

export function loadProperties() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveProperties(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

export function addProperty(property) {
  const list = loadProperties();
  const next = [...list, property];
  saveProperties(next);
  return next;
}

export function updateProperty(id, patch) {
  const list = loadProperties();
  const next = list.map((p) => (p.id === id ? { ...p, ...patch } : p));
  saveProperties(next);
  return next;
}

export function getPropertyById(id) {
  return loadProperties().find((p) => p.id === id) || null;
}