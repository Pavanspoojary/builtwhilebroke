/**
 * Master Purge Engine & Storage Management for BuiltWhileBroke
 * Implements real deep client-side storage inspection, live quota calculation, and multi-tier privacy purge.
 */

export interface StorageBreakdown {
  localStorageKeys: number;
  localStorageKeyList: string[];
  sessionStorageKeys: number;
  sessionStorageKeyList: string[];
  cacheStorageEntries: number;
  cacheNames: string[];
  indexedDbDatabases: number;
  indexedDbNames: string[];
  estimatedBytes: number;
  quotaBytes: number;
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

export async function inspectClientStorage(): Promise<StorageBreakdown> {
  const localKeys: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k) localKeys.push(k);
  }

  const sessionKeys: string[] = [];
  for (let i = 0; i < sessionStorage.length; i++) {
    const k = sessionStorage.key(i);
    if (k) sessionKeys.push(k);
  }

  const result: StorageBreakdown = {
    localStorageKeys: localKeys.length,
    localStorageKeyList: localKeys,
    sessionStorageKeys: sessionKeys.length,
    sessionStorageKeyList: sessionKeys,
    cacheStorageEntries: 0,
    cacheNames: [],
    indexedDbDatabases: 0,
    indexedDbNames: [],
    estimatedBytes: 0,
    quotaBytes: 0,
  };

  // Calculate approximate string size in localStorage
  let localApproxBytes = 0;
  for (const k of localKeys) {
    localApproxBytes += (k.length + (localStorage.getItem(k)?.length || 0)) * 2;
  }

  // 1. Inspect CacheStorage
  try {
    if ('caches' in window) {
      const keys = await caches.keys();
      result.cacheStorageEntries = keys.length;
      result.cacheNames = keys;
    }
  } catch (e) {
    console.debug('CacheStorage check skipped:', e);
  }

  // 2. Inspect IndexedDB
  try {
    if ('indexedDB' in window && 'databases' in indexedDB) {
      const dbs = await indexedDB.databases();
      result.indexedDbDatabases = dbs.length;
      result.indexedDbNames = dbs.map((d) => d.name || 'unnamed_db').filter(Boolean);
    }
  } catch (e) {
    console.debug('IndexedDB check skipped:', e);
  }

  // 3. Inspect Browser Quota API
  try {
    if (navigator.storage && navigator.storage.estimate) {
      const estimate = await navigator.storage.estimate();
      result.estimatedBytes = Math.max(estimate.usage || 0, localApproxBytes);
      result.quotaBytes = estimate.quota || 0;
    } else {
      result.estimatedBytes = localApproxBytes;
    }
  } catch (e) {
    console.debug('Storage estimation skipped:', e);
    result.estimatedBytes = localApproxBytes;
  }

  return result;
}

export async function purgeAllClientData(): Promise<{ success: boolean; clearedItems: string[]; totalBytesFreed: number }> {
  const cleared: string[] = [];
  const beforeInfo = await inspectClientStorage();

  // 1. Clear LocalStorage & SessionStorage
  try {
    const localCount = localStorage.length;
    const sessionCount = sessionStorage.length;
    localStorage.clear();
    sessionStorage.clear();
    cleared.push(`LocalStorage & SessionStorage (${localCount + sessionCount} keys)`);
  } catch (e) {
    console.error('Failed to clear web storage:', e);
  }

  // 2. Clear CacheStorage
  try {
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map((name) => caches.delete(name)));
      cleared.push(`Cache Storage (${cacheNames.length} cache stores)`);
    }
  } catch (e) {
    console.error('Failed to purge CacheStorage:', e);
  }

  // 3. Clear IndexedDB Databases
  try {
    if ('indexedDB' in window && 'databases' in indexedDB) {
      const dbs = await indexedDB.databases();
      for (const db of dbs) {
        if (db.name) {
          indexedDB.deleteDatabase(db.name);
        }
      }
      cleared.push(`IndexedDB (${dbs.length} databases)`);
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
    totalBytesFreed: beforeInfo.estimatedBytes,
  };
}
