import { toValue, type MaybeRefOrGetter } from 'vue';
import axios, { AxiosRequestConfig } from 'axios';
import { resolveRoute, getConfiguredHeaders, getWithCredentials, getClientIdHeader } from './config';
import { hasContent } from '../Helpers/Types';
import { buildCacheKey, dedupeRequest } from './internal/cacheUtils';

type RefStringOrNull = MaybeRefOrGetter<string | null | undefined>;
type MayBeRefData = MaybeRefOrGetter<any>;

/**
 * Busca dados de uma rota API com cache via localStorage.
 * Se já existir dado cacheado, retorna imediatamente sem fazer requisição.
 * Caso contrário, faz o GET e armazena o resultado para futuras chamadas.
 * Erros de rede HTTP propagam a rejeição.
 *
 * @param routeName - Nome da rota.
 * @param dataToRequest - Parâmetros da rota.
 * @param keyCache - Chave do cache no localStorage (padrão: `max_cache:routeName_params`).
 * @returns Os dados da API ou do cache local. Retorna null se `routeName` for vazio.
 */
export async function getCachedApi(
    routeName: RefStringOrNull,
    dataToRequest: MayBeRefData = null,
    keyCache: RefStringOrNull = null
): Promise<any> {
    const route_name = toValue(routeName);

    if (!hasContent(route_name)) return null;

    const data_request = toValue(dataToRequest) ?? {};
    const custom_key = toValue(keyCache);

    const rawKey = buildCacheKey(String(route_name), data_request, custom_key);
    const key = custom_key ? custom_key : `max_cache:${rawKey}`;

    const is_client = typeof localStorage !== 'undefined';

    if (is_client) {
        const stored = localStorage.getItem(key);
        if (stored) try {
            return JSON.parse(stored);
        } catch {
            try {
                localStorage.removeItem(key);
            } catch {
                // Silencia erro em ambientes restritos
            }
        }

    }

    return dedupeRequest(key, async () => {
        const routeUrl = resolveRoute(String(route_name), data_request);

        const config: AxiosRequestConfig = {
            responseType: 'json',
            headers: {
                ...getClientIdHeader(),
                ...getConfiguredHeaders()
            },
            withCredentials: getWithCredentials()
        };

        const response = await axios.get(routeUrl, config);
        const data_return = response.data;

        if (is_client) try {
            localStorage.setItem(key, JSON.stringify(data_return));
        } catch {
            // Silencia QuotaExceededError se o localStorage estiver cheio
        }


        return data_return;
    });
}