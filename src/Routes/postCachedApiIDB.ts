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
 * Busca dados de uma rota API via POST com cache via IndexedDB.
 * Se já existir dado cacheado (e não expirado), retorna sem fazer requisição.
 * Caso contrário, faz o POST e armazena o resultado para futuras chamadas.
 *
 * @param routeName - Nome da rota.
 * @param routeParams - Parâmetros da rota (URL params).
 * @param postData - Corpo da requisição POST.
 * @param keyCache - Chave do cache no IndexedDB (padrão: `routeName_clientId_params`).
 * @param ttl - Tempo de vida do cache em milissegundos (ex: 60000 = 1 min). Se não informado, o cache não expira.
 * @param options - Opções extras (ex: `{ signal }` para cancelamento).
 * @returns Os dados da API ou do cache. Retorna null se `routeName` for vazio.
 */
export async function postCachedApiIDB(
    routeName: RefStringOrNull,
    routeParams: MayBeRefData = null,
    postData: MayBeRefData = null,
    keyCache: RefStringOrNull = null,
    ttl?: number,
    options?: CachedApiOptions | null
): Promise<any> {
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
