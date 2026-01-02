/**
 * Primary Names Cache
 *
 * Stores address -> primary name mappings in IndexedDB with 24-hour expiration
 * to reduce API calls for group owner names
 */

const DB_NAME = 'PrimaryNamesCache';
const STORE_NAME = 'primary_names';
const DB_VERSION = 1;
const CACHE_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

interface CachedPrimaryName {
  address: string;
  primaryName: string | null;
  timestamp: number;
}

/**
 * Open the IndexedDB database
 */
const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      // Create object store if it doesn't exist
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const objectStore = db.createObjectStore(STORE_NAME, {
          keyPath: 'address',
        });
        objectStore.createIndex('timestamp', 'timestamp', { unique: false });
      }
    };
  });
};

/**
 * Get a cached primary name for an address
 * @param address - The Qortal address
 * @returns The cached primary name, or undefined if not cached or expired
 */
export const getCachedPrimaryName = async (
  address: string
): Promise<string | null | undefined> => {
  try {
    const db = await openDB();
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);

    return new Promise((resolve, reject) => {
      const request = store.get(address);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const cached = request.result as CachedPrimaryName | undefined;

        if (!cached) {
          resolve(undefined); // Not cached
          return;
        }

        // Check if cache has expired
        const now = Date.now();
        if (now - cached.timestamp > CACHE_DURATION_MS) {
          // Cache expired, delete it and return undefined
          const deleteTransaction = db.transaction(STORE_NAME, 'readwrite');
          const deleteStore = deleteTransaction.objectStore(STORE_NAME);
          deleteStore.delete(address);
          resolve(undefined);
          return;
        }

        resolve(cached.primaryName);
      };
    });
  } catch (error) {
    console.error('Error getting cached primary name:', error);
    return undefined;
  }
};

/**
 * Set a cached primary name for an address
 * @param address - The Qortal address
 * @param primaryName - The primary name (or null if user has no name)
 */
export const setCachedPrimaryName = async (
  address: string,
  primaryName: string | null
): Promise<void> => {
  try {
    const db = await openDB();
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);

    const cached: CachedPrimaryName = {
      address,
      primaryName,
      timestamp: Date.now(),
    };

    return new Promise((resolve, reject) => {
      const request = store.put(cached);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  } catch (error) {
    console.error('Error setting cached primary name:', error);
  }
};

/**
 * Clean up expired cache entries
 * This should be called periodically (e.g., on app startup)
 */
export const cleanupExpiredPrimaryNames = async (): Promise<void> => {
  try {
    const db = await openDB();
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);

    const now = Date.now();

    return new Promise((resolve, reject) => {
      const request = store.openCursor();

      request.onerror = () => reject(request.error);
      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result;

        if (cursor) {
          const cached = cursor.value as CachedPrimaryName;

          // Delete if expired
          if (now - cached.timestamp > CACHE_DURATION_MS) {
            cursor.delete();
          }

          cursor.continue();
        } else {
          resolve();
        }
      };
    });
  } catch (error) {
    console.error('Error cleaning up expired primary names:', error);
  }
};

