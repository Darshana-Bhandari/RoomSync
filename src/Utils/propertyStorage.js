const STORAGE_KEY = "roomsync_properties";

/**
 * Validates if an image URL is usable (not a blob URL, not null/empty)
 * Blob URLs like blob:http://... are temporary and should not be stored
 */
const isValidImageUrl = (url) => {
  if (!url || typeof url !== "string") return false;
  if (url.startsWith("blob:")) {
    console.warn(
      "[propertyStorage] Invalid blob URL detected in storage:",
      url,
      "— Please re-upload the photo for this property."
    );
    return false;
  }
  return true;
};

/**
 * Migrates old properties with blob URLs or missing image fields
 * This ensures old properties don't break the dashboard
 */
const migratePropertyImages = (property) => {
  if (!property) return property;

  const migrated = { ...property };

  // Check if any image field has an invalid blob URL
  if (!isValidImageUrl(migrated.coverUrl)) {
    migrated.coverUrl = null;
  }
  if (!isValidImageUrl(migrated.imageUrl)) {
    migrated.imageUrl = null;
  }
  if (!isValidImageUrl(migrated.image)) {
    migrated.image = null;
  }

  // Log if an old property lost its image due to blob URL
  if (property.coverUrl && !migrated.coverUrl && property.coverUrl.startsWith("blob:")) {
    console.info(
      `[propertyStorage] Cleared invalid blob URL for property "${property.name}" (ID: ${property.id}). User should re-upload the photo.`
    );
  }

  return migrated;
};

/**
 * Load all properties from localStorage
 * Applies migration to clean up old blob URLs
 */
export const loadProperties = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];

    let properties = JSON.parse(data);

    // Apply migration to all properties
    properties = properties.map(migratePropertyImages);

    return properties;
  } catch (error) {
    console.error("[propertyStorage] Error loading properties:", error);
    return [];
  }
};

/**
 * Save all properties to localStorage
 */
export const saveProperties = (properties) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(properties));
  } catch (error) {
    console.error("[propertyStorage] Error saving properties:", error);
    if (error.name === "QuotaExceededError") {
      console.error(
        "[propertyStorage] localStorage quota exceeded. Consider archiving old properties."
      );
    }
  }
};

/**
 * Add a new property
 * Validates that image URLs are not blob URLs before saving
 */
export const addProperty = (property) => {
  if (!property || !property.id) {
    console.error("[propertyStorage] Invalid property object");
    return;
  }

  // Ensure coverUrl is a valid persistent image (Base64 or https URL, not blob)
  if (property.coverUrl && property.coverUrl.startsWith("blob:")) {
    console.warn(
      "[propertyStorage] Attempted to save blob URL as coverUrl. This will not persist. Use Base64 data URLs instead."
    );
    property.coverUrl = null;
  }

  const properties = loadProperties();
  properties.push(property);
  saveProperties(properties);
};

/**
 * Update an existing property
 */
export const updateProperty = (id, updates) => {
  const properties = loadProperties();
  const index = properties.findIndex((p) => p.id === id);

  if (index === -1) {
    console.error(`[propertyStorage] Property with ID ${id} not found`);
    return;
  }

  // Validate image URLs before updating
  if (updates.coverUrl && updates.coverUrl.startsWith("blob:")) {
    console.warn(
      "[propertyStorage] Attempted to save blob URL as coverUrl. This will not persist. Use Base64 data URLs instead."
    );
    updates.coverUrl = null;
  }

  properties[index] = { ...properties[index], ...updates };
  saveProperties(properties);
};

/**
 * Get a single property by ID
 */
export const getPropertyById = (id) => {
  const properties = loadProperties();
  const property = properties.find((p) => p.id === id);
  return property ? migratePropertyImages(property) : null;
};

/**
 * Delete a property by ID
 */
export const deleteProperty = (id) => {
  const properties = loadProperties();
  const filtered = properties.filter((p) => p.id !== id);
  saveProperties(filtered);
};

/**
 * Dispatch a custom event when properties are updated
 * Allows other components to react to property changes
 */
export const notifyPropertiesUpdated = () => {
  window.dispatchEvent(
    new CustomEvent("propertiesUpdated", {
      detail: { timestamp: new Date().toISOString() },
    })
  );
};