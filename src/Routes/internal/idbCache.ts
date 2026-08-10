/**
 * Camada de cache em IndexedDB compartilhada pelos helpers `*CachedApiIDB`.
 *
 * Este módulo é interno: o ponto de entrada público continua sendo
 * `getCachedApiIDB` / `postCachedApiIDB`, que reexportam `deleteFromIDB` e
 * `clearCacheIDB`.
 *
 * @internal
 */
import { onResetConfig } from '../config';

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

/** Envelope retornado em caso de hit no cache */
export interface IDBCacheHit<T = any> {
    hit: true;
    data: T;
}

let dbPromise: Promise<IDBDatabase | null> | null = null;

/**
 * Reseta e fecha a conexão memoizada com o IndexedDB.
 * @internal
 */
export function resetIDBConnection(): void {
    if (dbPromise) {
        dbPromise
            .then((db) => {
                if (db) try {
                    db.close();
                } catch {}

            })
            .catch(() => {});
        dbPromise = null;
    }
}

// Registra a limpeza da conexão no reset de configurações da biblioteca
onResetConfig(() => {
    resetIDBConnection();
});

/**
 * Abre (ou reutiliza) a conexão com o banco IndexedDB `max_cache`.
 * Retorna uma Promise com a instância do banco (ou null se em ambiente sem IDB/SSR).
 *
 * @internal
 */
export function openDB(): Promise<IDBDatabase | null> {
    if (typeof window === 'undefined' || typeof indexedDB === 'undefined') return Promise.resolve(null);


    if (dbPromise) return dbPromise;

    dbPromise = new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = () => {
            const db = request.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) db.createObjectStore(STORE_NAME, { keyPath: 'key' });

        };

        request.onsuccess = () => {
            const db = request.result;
            db.onversionchange = () => {
                try {
                    db.close();
                } catch {}
                dbPromise = null;
            };
            resolve(db);
        };

        request.onerror = () => {
            dbPromise = null;
            reject(request.error);
        };

        request.onblocked = () => {
            dbPromise = null;
            reject(new Error('Conexão IndexedDB bloqueada por outra aba.'));
        };
    });

    return dbPromise;
}

/**
 * Busca uma entrada do cache no IndexedDB pela chave.
 *
 * @param key - Chave do cache.
 * @param ttl - Tempo de vida em milissegundos. Se expirado ou ttl=0, retorna null.
 *
 * @internal
 */
export async function getFromIDB<T = any>(key: string, ttl?: number): Promise<IDBCacheHit<T> | null> {
    const db = await openDB();
    if (!db) return null;

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
            if (ttl !== undefined && Date.now() - entry.timestamp >= ttl) {
                deleteFromIDB(key).catch(() => {});
                resolve(null);
                return;
            }

            resolve({ hit: true, data: entry.data });
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
    if (!db) return;

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
    if (!db) return;

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
    if (!db) return;

    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        const request = store.clear();

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
}
