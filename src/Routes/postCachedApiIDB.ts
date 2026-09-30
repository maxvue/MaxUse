import { toValue, type MaybeRefOrGetter } from 'vue';
import axios, { AxiosRequestConfig } from 'axios';
import { resolveRoute, getConfiguredHeaders, getWithCredentials, getClientIdHeader } from './config';
import { isBlank } from '../Helpers/Types';
import { getFromIDB, setToIDB } from './internal/idbCache';
import { buildCacheKey, dedupeRequest, hasInFlight, raceWithSignal } from './internal/cacheUtils';
import { createAbortError } from './internal/abortUtils';
import type { CachedApiOptions } from './getCachedApi';

type RefStringOrNull = MaybeRefOrGetter<string | null | undefined>;
type MayBeRefData = MaybeRefOrGetter<any>;

/**
 * Fetches API route data via POST with IndexedDB caching.
 * If valid unexpired cached data exists, returns it immediately without issuing a request.
 * Otherwise, sends the POST request, stores the result in IndexedDB, and returns it.
 *
 * @template T - Expected response data type.
 * @param routeName - Route name or getter.
 * @param routeParams - Route parameters (URL params resolved by route resolver).
 * @param postData - Request payload body for POST.
 * @param keyCache - Cache key in IndexedDB (defaults to `${routeName}_${clientId}_${params}`).
 * @param ttl - Cache time-to-live in milliseconds (e.g., 3_600_000 for 1 hour). If omitted, never expires.
 * @param options - Additional options including AbortSignal.
 * @returns Cached or fresh API data, or null if routeName is blank.
 */
export async function postCachedApiIDB<T = any>(
    routeName: RefStringOrNull,
    routeParams: MayBeRefData = null,
    postData: MayBeRefData = null,
    keyCache: RefStringOrNull = null,
    ttl?: number,
    options?: CachedApiOptions | null
): Promise<T | null> {
    const route_name = toValue(routeName);

    if (isBlank(route_name)) return null;

    const route_params = toValue(routeParams) ?? {};
    const post_data = toValue(postData) ?? {};
    const custom_key = toValue(keyCache);

    const key = buildCacheKey(String(route_name), { routeParams: route_params, postData: post_data }, custom_key);

    const signal = options?.signal;
    if (signal?.aborted) throw createAbortError();

    // Tenta buscar do IndexedDB (degrada graciosamente se houver erro ao ler o cache)
    const cached = await getFromIDB(key, ttl).catch(() => null);

    if (cached && cached.hit) return cached.data;

    const dedupe_key = `idb:POST:${key}`;
    // Só propaga o sinal ao axios quando este chamador origina a requisição.
    const owns_request = !hasInFlight(dedupe_key);

    const request = dedupeRequest(dedupe_key, async () => {
        // Faz a requisição POST se não houver cache válido
        const routeUrl = resolveRoute(String(route_name), route_params);

        const config: AxiosRequestConfig = {
            responseType: 'json',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                ...getClientIdHeader(),
                ...getConfiguredHeaders()
            },
            withCredentials: getWithCredentials(),
            ...(owns_request && signal ? { signal } : {})
        };

        const response = await axios.post(routeUrl, post_data, config);
        const data_return = response.data;

        // Salva no IndexedDB de forma não-fatal
        await setToIDB(key, data_return).catch(() => {});

        return data_return;
    });

    return raceWithSignal(request, signal);
}
