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
 * @param options - Opções extras (ex: `{ signal }` para cancelamento). A revalidação em background não é cancelável.
 * @returns Os dados da API ou do cache. Retorna null se `routeName` for vazio.
 */
export async function getCachedApiIDB(
    routeName: RefStringOrNull,
    dataToRequest: MayBeRefData = null,
    keyCache: RefStringOrNull = null,
    ttl?: number,
    onUpdate?: (data: any) => void,
    options?: CachedApiOptions | null
): Promise<any> {
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
