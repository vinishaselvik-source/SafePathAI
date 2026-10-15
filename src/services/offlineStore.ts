import { OfflineQueueItem, Incident } from '../types';
import { api } from './api';

const DB_NAME = 'SAROS_OFFLINE_DB';
const DB_VERSION = 1;
const STORE_NAME = 'sos_queue';

class OfflineStore {
  private db: IDBDatabase | null = null;
  private isSimulatedOffline: boolean = false;
  private listeners: Array<() => void> = [];

  constructor() {
    this.initDB().then(() => {
      this.setupNetworkListeners();
    });
  }

  private async initDB(): Promise<void> {
    if (typeof window === 'undefined' || !window.indexedDB) {
      console.warn('[SAROS Offline] IndexedDB not available, using memory fallback');
      return;
    }

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: 'clientIncidentId' });
          store.createIndex('syncStatus', 'syncStatus', { unique: false });
          store.createIndex('queuedAt', 'queuedAt', { unique: false });
        }
      };

      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onerror = () => {
        console.error('[SAROS Offline] IndexedDB error:', request.error);
        reject(request.error);
      };
    });
  }

  // Connectivity detection & simulation
  isOnline(): boolean {
    if (this.isSimulatedOffline) return false;
    if (typeof navigator !== 'undefined' && 'onLine' in navigator) {
      return navigator.onLine;
    }
    return true;
  }

  setSimulatedOffline(offline: boolean) {
    this.isSimulatedOffline = offline;
    this.notify();
    if (!offline && this.isOnline()) {
      this.syncPendingQueue();
    }
  }

  getSimulatedOffline(): boolean {
    return this.isSimulatedOffline;
  }

  private setupNetworkListeners() {
    if (typeof window === 'undefined') return;

    window.addEventListener('online', () => {
      this.notify();
      if (!this.isSimulatedOffline) {
        this.syncPendingQueue();
      }
    });

    window.addEventListener('offline', () => {
      this.notify();
    });
  }

  subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach(l => l());
  }

  // --- IndexedDB Operations ---
  async enqueueSOS(item: Omit<OfflineQueueItem, 'queuedAt' | 'retryCount' | 'syncStatus'>): Promise<OfflineQueueItem> {
    const queueItem: OfflineQueueItem = {
      ...item,
      queuedAt: new Date().toISOString(),
      retryCount: 0,
      syncStatus: 'QUEUED'
    };

    if (this.db) {
      await new Promise<void>((resolve, reject) => {
        const tx = this.db!.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        const req = store.put(queueItem);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      });
    } else {
      // localStorage fallback
      const current = this.getLocalStorageQueue();
      current.push(queueItem);
      localStorage.setItem(STORE_NAME, JSON.stringify(current));
    }

    this.notify();

    // If online, immediately attempt sync
    if (this.isOnline()) {
      this.syncPendingQueue();
    }

    return queueItem;
  }

  async getQueue(): Promise<OfflineQueueItem[]> {
    if (this.db) {
      return new Promise((resolve) => {
        const tx = this.db!.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const req = store.getAll();
        req.onsuccess = () => {
          resolve((req.result || []).sort(
            (a, b) => new Date(b.queuedAt).getTime() - new Date(a.queuedAt).getTime()
          ));
        };
        req.onerror = () => resolve([]);
      });
    } else {
      return this.getLocalStorageQueue();
    }
  }

  async removeQueueItem(clientIncidentId: string): Promise<void> {
    if (this.db) {
      await new Promise<void>((resolve) => {
        const tx = this.db!.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        const req = store.delete(clientIncidentId);
        req.onsuccess = () => resolve();
        req.onerror = () => resolve();
      });
    } else {
      const filtered = this.getLocalStorageQueue().filter(i => i.clientIncidentId !== clientIncidentId);
      localStorage.setItem(STORE_NAME, JSON.stringify(filtered));
    }
    this.notify();
  }

  async updateQueueItem(item: OfflineQueueItem): Promise<void> {
    if (this.db) {
      await new Promise<void>((resolve) => {
        const tx = this.db!.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        store.put(item);
        tx.oncomplete = () => resolve();
      });
    } else {
      const list = this.getLocalStorageQueue().map(i => i.clientIncidentId === item.clientIncidentId ? item : i);
      localStorage.setItem(STORE_NAME, JSON.stringify(list));
    }
    this.notify();
  }

  private getLocalStorageQueue(): OfflineQueueItem[] {
    try {
      const raw = localStorage.getItem(STORE_NAME);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  // --- Synchronization Engine ---
  async syncPendingQueue(): Promise<{ synced: number; failed: number }> {
    if (!this.isOnline()) {
      return { synced: 0, failed: 0 };
    }

    const items = await this.getQueue();
    const pendingItems = items.filter(i => i.syncStatus !== 'SYNCING');
    if (pendingItems.length === 0) return { synced: 0, failed: 0 };

    let syncedCount = 0;
    let failedCount = 0;

    for (const item of pendingItems) {
      try {
        item.syncStatus = 'SYNCING';
        await this.updateQueueItem(item);

        // Send to backend with stable clientIncidentId (idempotent)
        await api.createIncident({
          clientIncidentId: item.clientIncidentId,
          category: item.category,
          description: item.description,
          location: item.location,
          peopleCount: item.peopleCount,
          priority: item.priority,
          submissionMethod: 'OFFLINE_SYNC',
          meshHops: 0,
          userName: item.userName
        });

        // Once successfully registered on server, delete from local offline queue
        await this.removeQueueItem(item.clientIncidentId);
        syncedCount++;
      } catch (err: any) {
        console.error(`[SAROS Offline] Failed to sync ${item.clientIncidentId}:`, err);
        item.syncStatus = 'FAILED';
        item.retryCount += 1;
        item.lastError = err.message || 'Network unreachable';
        await this.updateQueueItem(item);
        failedCount++;
      }
    }

    this.notify();
    return { synced: syncedCount, failed: failedCount };
  }
}

export const offlineStore = new OfflineStore();
