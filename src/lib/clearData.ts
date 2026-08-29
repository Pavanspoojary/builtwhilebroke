/**
 * Master Purge Engine & Storage Management for BuiltWhileBroke
 * Implements full client-side privacy reset, cache clearing, and IndexedDB purge.
 */

export interface StorageBreakdown {
  localStorageKeys: number;
  sessionStorageKeys: number;
  cacheStorageEntries: number;
  indexedDbDatabases: number;
  estimatedBytes: number;
}

export async function inspectClientStorage(): Promise<StorageBreakdown> {
  const result: StorageBreakdown = {
    localStorageKeys: localStorage.length,
    sessionStorageKeys: sessionStorage.length,
    cacheStorageEntries: 0,
    indexedDbDatabases: 0,
    estimatedBytes: 0,
  };

  try {
    if ('caches' in window) {
      const keys = await caches.keys();
      result.cacheStorageEntries = keys.length;
    }
  } catch (e) {
    console.debug('CacheStorage check skipped:', e);
  }

  try {
    if ('indexedDB' in window && 'databases' in indexedDB) {
      const dbs = await indexedDB.databases();
      result.indexedDbDatabases = dbs.length;
    }
  } catch (e) {
    console.debug('IndexedDB check skipped:', e);
  }

  try {
    if (navigator.storage && navigator.storage.estimate) {
      const estimate = await navigator.storage.estimate();
      result.estimatedBytes = estimate.usage || 0;
    }
  } catch (e) {
    console.debug('Storage estimation skipped:', e);
  }

  return result;
}

export async function purgeAllClientData(): Promise<{ success: boolean; clearedItems: string[] }> {
  const cleared: string[] = [];

  // 1. Clear LocalStorage & SessionStorage
  try {
    localStorage.clear();
    sessionStorage.clear();
    cleared.push('Local & Session Storage');
  } catch (e) {
    console.error('Failed to clear web storage:', e);
  }

  // 2. Clear CacheStorage
  try {
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map((name) => caches.delete(name)));
      if (cacheNames.length > 0) {
        cleared.push(`Cache Storage (${cacheNames.length} buckets)`);
      }
    }
  } catch (e) {
    console.error('Failed to purge CacheStorage:', e);
  }

  // 3. Clear IndexedDB
  try {
    if ('indexedDB' in window && 'databases' in indexedDB) {
      const dbs = await indexedDB.databases();
      for (const db of dbs) {
        if (db.name) {
          indexedDB.deleteDatabase(db.name);
        }
      }
      if (dbs.length > 0) {
        cleared.push(`IndexedDB (${dbs.length} databases)`);
      }
    }
  } catch (e) {
    console.error('Failed to purge IndexedDB:', e);
  }

  // 4. Unregister Service Workers
  try {
    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      for (const reg of registrations) {
        await reg.unregister();
      }
      if (registrations.length > 0) {
        cleared.push(`Service Workers (${registrations.length} unregistered)`);
      }
    }
  } catch (e) {
    console.error('Failed to unregister Service Workers:', e);
  }

  return {
    success: true,
    clearedItems: cleared,
  };
}
