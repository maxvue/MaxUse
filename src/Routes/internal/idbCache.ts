/**
 * Camada de cache em IndexedDB compartilhada pelos helpers `*CachedApiIDB`.
 *
 * Este módulo é interno: o ponto de entrada público continua sendo
 * `getCachedApiIDB` / `postCachedApiIDB`, que reexportam `deleteFromIDB` e
 * `clearCacheIDB`.
 *
 * @internal
 */

/** Nome do banco IndexedDB */
const DB_NAME = 'max_cache';
/** Nome do object store */
const STORE_NAME = 'api_cache';
/** Versão do banco */
const DB_VERSION = 1;

/** Estrutura de cada entrada no cache */
export interface CacheEntry {
    key: string;
    data: any;
    timestamp: number;
}

/**
 * Abre (ou cria) o banco IndexedDB `max_cache`.
 * Retorna uma Promise com a instância do banco.
 *
 * @internal
 */
export function openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = () => {
            const db = request.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) db.createObjectStore(STORE_NAME, { keyPath: 'key' });

        };

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

/**
 * Busca uma entrada do cache no IndexedDB pela chave.
 *
 * @param key - Chave do cache.
 * @param ttl - Tempo de vida em milissegundos. Se expirado, retorna null.
 *
 * @internal
 */
export async function getFromIDB(key: string, ttl?: number): Promise<any | null> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const request = store.get(key);

        request.onsuccess = () => {
            const entry: CacheEntry | undefined = request.result;

            if (!entry) {
                resolve(null);
                return;
            }

            // Verifica se o cache expirou (se TTL foi informado)
            if (ttl && Date.now() - entry.timestamp > ttl) {
                // Remove a entrada expirada em background
                deleteFromIDB(key).catch(() => {});
                resolve(null);
                return;
            }

            resolve(entry.data);
        };

        request.onerror = () => reject(request.error);
    });
}

/**
 * Grava uma entrada no cache do IndexedDB.
 *
 * @param key - Chave do cache.
 * @param data - Dados a serem armazenados.
 *
 * @internal
 */
export async function setToIDB(key: string, data: any): Promise<void> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);

        const entry: CacheEntry = { key, data, timestamp: Date.now() };
        const request = store.put(entry);

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
}

/**
 * Remove uma entrada específica do cache do IndexedDB.
 *
 * @param key - Chave do cache a ser removida.
 */
export async function deleteFromIDB(key: string): Promise<void> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        const request = store.delete(key);

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
}

/**
 * Limpa todo o cache do IndexedDB.
 */
export async function clearCacheIDB(): Promise<void> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        const request = store.clear();

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
}
