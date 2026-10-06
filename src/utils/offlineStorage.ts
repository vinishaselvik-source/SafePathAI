// Offline Storage Utility for SafePath AI

const STORAGE_KEYS = {
  TRIP_DETAILS: 'safepath_trip_details',
  CHECKLIST: 'safepath_checklist_items',
  INCIDENTS: 'safepath_incidents',
  CONTACTS: 'safepath_contacts',
  OFFLINE_PACK: 'safepath_offline_pack_enabled',
};

export const loadOfflineState = <T>(key: string, fallback: T): T => {
  try {
    const saved = localStorage.getItem(key);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.warn('Error loading offline state:', e);
  }
  return fallback;
};

export const saveOfflineState = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn('Error saving offline state:', e);
  }
};

export { STORAGE_KEYS };
