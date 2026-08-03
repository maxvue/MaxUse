import { toValue, type MaybeRefOrGetter } from 'vue';
import axios, { AxiosRequestConfig } from 'axios';
import { resolveRoute } from './config';
import { isBlank } from '../Helpers/Types';

type RefStringOrNull = MaybeRefOrGetter<string | null | undefined>;
type MayBeRefData = MaybeRefOrGetter<any>;

/** Nome do banco IndexedDB */
const DB_NAME = 'max_cache';
/** Nome do object store */
const STORE_NAME = 'api_cache';
/** Versão do banco */
const DB_VERSION = 1;

/** Estrutura de cada entrada no cache */
interface CacheEntry {
    key: string;
    data: any;
    timestamp: number;
}

/**
 * Abre (ou cria) o banco IndexedDB `max_cache`.
 * Retorna uma Promise com a instância do banco.
 */
function openDB(): Promise<IDBDatabase> {
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
 */
async function getFromIDB(key: string, ttl?: number): Promise<any | null> {
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
 */
async function setToIDB(key: string, data: any): Promise<void> {
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

/**
 * Faz o GET na rota e persiste o resultado no cache do IndexedDB.
 */
async function fetchAndStore(route_name: string, data_request: any, key: string): Promise<any> {
    const routeUrl = resolveRoute(route_name, data_request);

    const config: AxiosRequestConfig = { responseType: 'json' };
    axios.defaults.withCredentials = true;
    const response = await axios.get(routeUrl, config);
    const data_return = response.data;

    await setToIDB(key, data_return);

    return data_return;
}

/**
 * Busca dados de uma rota API com cache via IndexedDB (stale-while-revalidate).
 * Se já existir dado cacheado (e não expirado), retorna imediatamente e revalida em background:
 * a requisição é disparada mesmo assim e, se o dado do servidor for diferente do cacheado,
 * o cache é atualizado e `onUpdate` é chamado com o dado fresco.
 * Sem cache válido, faz o GET, armazena e retorna o resultado.
 *
 * @param routeName - Nome da rota.
 * @param dataToRequest - Parâmetros da rota.
 * @param keyCache - Chave do cache no IndexedDB (padrão: `routeName_params`).
 * @param ttl - Tempo de vida do cache em milissegundos (ex: 60000 = 1 min). Se não informado, o cache não expira.
 * @param onUpdate - Callback chamado com o dado fresco quando a revalidação em background encontra diferença.
 * @returns Os dados da API ou do cache. Retorna null se `routeName` for vazio.
 */
export async function getCachedApiIDB( routeName: RefStringOrNull, dataToRequest: MayBeRefData = null, keyCache: RefStringOrNull = null, ttl?: number, onUpdate?: (data: any) => void ): Promise<any> {

    const route_name = toValue(routeName);

    if (isBlank(route_name)) return null;

    const data_request = toValue(dataToRequest) ?? {};

    const key = toValue(keyCache) ?? route_name + '_' + JSON.stringify(data_request);

    // Tenta buscar do IndexedDB
    const cached = await getFromIDB(key, ttl);

    if (cached) {
        // Revalida em background: atualiza o cache e notifica se o servidor tiver dado diferente
        fetchAndStore(String(route_name), data_request, key)
            .then((fresh) => {
                if (onUpdate && JSON.stringify(fresh) !== JSON.stringify(cached)) onUpdate(fresh);
            })
            .catch(() => {});

        return cached;
    }

    return fetchAndStore(String(route_name), data_request, key);
}
