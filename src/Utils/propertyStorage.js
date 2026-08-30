const STORAGE_KEY = "roomsync_properties";

export function loadProperties() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const list = raw ? JSON.parse(raw) : [];
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

export function saveProperties(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  // Notify dashboard (and any other listeners)
  window.dispatchEvent(new Event("propertiesUpdated"));
}

export function addProperty(property) {
  const list = loadProperties();
  // Enrich with empty nested collections so dashboard never crashes
  const enriched = {
    ...property,
    roomsList: property.roomsList || [],
    residents: property.residents || [],
    bills: property.bills || [],
    expenses: property.expenses || [],
    chores: property.chores || [],
    activities: property.activities || [],
    occupiedCapacity: property.occupiedCapacity || 0,
  };
  const next = [...list, enriched];
  saveProperties(next);
  return next;
}

export function updateProperty(id, patch) {
  const list = loadProperties();
  const next = list.map((p) =>
    p.id === id ? { ...p, ...patch } : p
  );
  saveProperties(next);
  return next;
}

export function getPropertyById(id) {
  return loadProperties().find((p) => String(p.id) === String(id)) || null;
}

/**
 * Optional helper: seed demo rooms/residents for a newly created property
 * so the dashboard isn't empty. Call from Property.js after create if you want.
 */
export function seedDemoDataForProperty(propertyId) {
  const list = loadProperties();
  const property = list.find((p) => p.id === propertyId);
  if (!property) return list;

  const roomCount = Number(property.rooms) || 0;
  const capacityPerRoom = Number(property.peoplePerRoom) || 1;
  const rentPerRoom = Number(property.rent) || 0;

  const roomsList = Array.from({ length: roomCount }, (_, i) => ({
    id: `room-${propertyId}-${i + 1}`,
    name: `Room ${101 + i}`,
    capacity: capacityPerRoom,
    residentsCount: 0,
  }));

  // Put a couple of demo residents so occupancy/rent stats work
  const residents = [];
  if (roomCount > 0) {
    residents.push({
      id: `res-${propertyId}-1`,
      name: "Demo Resident 1",
      roomId: roomsList[0].id,
      roomName: roomsList[0].name,
      rent: Math.round(rentPerRoom / capacityPerRoom) || rentPerRoom,
      rentStatus: "PAID",
      paidAmount: Math.round(rentPerRoom / capacityPerRoom) || rentPerRoom,
    });
    roomsList[0].residentsCount = 1;
  }
  if (roomCount > 1) {
    residents.push({
      id: `res-${propertyId}-2`,
      name: "Demo Resident 2",
      roomId: roomsList[1].id,
      roomName: roomsList[1].name,
      rent: Math.round(rentPerRoom / capacityPerRoom) || rentPerRoom,
      rentStatus: "OVERDUE",
      paidAmount: 0,
    });
    roomsList[1].residentsCount = 1;
  }

  const occupiedCapacity = residents.length;
  const activities = [
    {
      id: `act-${propertyId}-1`,
      type: "property",
      title: "Property created",
      description: `${property.name} was added`,
      time: "Just now",
    },
  ];

  return updateProperty(propertyId, {
    roomsList,
    residents,
    occupiedCapacity,
    activities,
    bills: [],
    expenses: [],
    chores: [],
  });
}