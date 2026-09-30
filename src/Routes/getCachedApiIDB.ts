import { toValue, type MaybeRefOrGetter } from 'vue';
import axios, { AxiosRequestConfig } from 'axios';
import { resolveRoute, getConfiguredHeaders, getWithCredentials, getClientIdHeader } from './config';
import { isBlank } from '../Helpers/Types';
import { isEqual } from '../Helpers/Objects/isEqual';
import { getFromIDB, setToIDB, deleteFromIDB, clearCacheIDB } from './internal/idbCache';
import { buildCacheKey, dedupeRequest, hasInFlight, raceWithSignal } from './internal/cacheUtils';
import { createAbortError } from './internal/abortUtils';
import type { CachedApiOptions } from './getCachedApi';

type RefStringOrNull = MaybeRefOrGetter<string | null | undefined>;
type MayBeRefData = MaybeRefOrGetter<any>;

// Reexporta a API pública de manutenção do cache (mantida para não quebrar consumidores)
export { deleteFromIDB, clearCacheIDB };

/**
 * Faz o GET na rota e persiste o resultado no cache do IndexedDB com deduplicação.
 */
async function fetchAndStore(route_name: string, data_request: any, key: string, signal?: AbortSignal): Promise<any> {
    const dedupe_key = `idb:GET:${key}`;
    // Só propaga o sinal ao axios quando este chamador origina a requisição.
    const owns_request = !hasInFlight(dedupe_key);

    return dedupeRequest(dedupe_key, async () => {
        const routeUrl = resolveRoute(route_name, data_request);

        const config: AxiosRequestConfig = {
            responseType: 'json',
            headers: {
                ...getClientIdHeader(),
                ...getConfiguredHeaders()
            },
            withCredentials: getWithCredentials(),
            ...(owns_request && signal ? { signal } : {})
        };

        const response = await axios.get(routeUrl, config);
        const data_return = response.data;

        await setToIDB(key, data_return).catch(() => {});

        return data_return;
    });
}

/**
 * Fetches API route data with IndexedDB cache (stale-while-revalidate pattern).
 * If valid cache entry exists, returns it immediately and revalidates in the background:
 * the request is fired anyway, and if server data differs from cached data,
 * the cache is updated and `onUpdate` is called with the fresh data.
 * Without valid cache, executes GET, stores in IndexedDB, and returns the result.
 *
 * @template T - Expected response data type.
 * @param routeName - Route name or getter.
 * @param dataToRequest - Route parameters or payload.
 * @param keyCache - Cache key in IndexedDB (defaults to `${routeName}_${params}`).
 * @param ttl - Cache time-to-live in milliseconds (e.g., 3_600_000 for 1 hour). If omitted, never expires.
 * @param onUpdate - Callback invoked with fresh data if background revalidation detects differences.
 * @param options - Additional options including AbortSignal.
 * @returns Cached or fresh API data, or null if routeName is blank.
 */
export async function getCachedApiIDB<T = any>(
    routeName: RefStringOrNull,
    dataToRequest: MayBeRefData = null,
    keyCache: RefStringOrNull = null,
    ttl?: number,
    onUpdate?: (data: T) => void,
    options?: CachedApiOptions | null
): Promise<T | null> {
    const route_name = toValue(routeName);

    if (isBlank(route_name)) return null;

    const data_request = toValue(dataToRequest) ?? {};
    const custom_key = toValue(keyCache);

    const key = buildCacheKey(String(route_name), data_request, custom_key);

    const signal = options?.signal;
    if (signal?.aborted) throw createAbortError();

    // Tenta buscar do IndexedDB (degrada graciosamente se houver erro ao ler o cache)
    const cached = await getFromIDB(key, ttl).catch(() => null);

    if (cached && cached.hit) {
        // Revalida em background: atualiza o cache e notifica se o servidor tiver dado diferente
        fetchAndStore(String(route_name), data_request, key)
            .then((fresh) => {
                if (onUpdate && !isEqual(fresh, cached.data)) onUpdate(fresh);
            })
            .catch(() => {});

        return cached.data;
    }

    return raceWithSignal(fetchAndStore(String(route_name), data_request, key, signal), signal);
}
