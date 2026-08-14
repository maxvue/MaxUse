import { toValue, type MaybeRefOrGetter } from 'vue';
import axios, { AxiosRequestConfig } from 'axios';
import { resolveRoute, getConfiguredHeaders, getWithCredentials, getClientIdHeader } from './config';
import { hasContent } from '../Helpers/Types';
import { buildCacheKey, dedupeRequest, invalidateDedupeKey } from './internal/cacheUtils';

type RefStringOrNull = MaybeRefOrGetter<string | null | undefined>;
type MayBeRefData = MaybeRefOrGetter<any>;

/**
 * Limpa uma chave específica ou todo o cache do localStorage gerenciado por `getCachedApi`.
 *
 * - Com `key`: remove tanto a chave crua (usada quando se informa `keyCache` customizado)
 *   quanto a variante prefixada `max_cache:<key>`.
 * - Sem `key`: remove **apenas** as chaves prefixadas com `max_cache:`. Chaves gravadas sob
 *   `keyCache` customizado não têm prefixo e são indistinguíveis das chaves do aplicativo
 *   hospedeiro, portanto **não** são removidas — limpe-as individualmente com
 *   `clearCachedApi(minhaChave)`.
 *
 * Nenhuma chave alheia à biblioteca é apagada.
 */
export function clearCachedApi(key?: string): void {
    if (typeof localStorage === 'undefined') return;

    try {
        if (key) {
            localStorage.removeItem(key);
            localStorage.removeItem(`max_cache:${key}`);
            invalidateDedupeKey(key);
            invalidateDedupeKey(`max_cache:${key}`);
        } else {
            const keysToRemove: string[] = [];
            for (let i = 0; i < localStorage.length; i++) {
                const k = localStorage.key(i);
                if (k && k.startsWith('max_cache:')) keysToRemove.push(k);
            }
            keysToRemove.forEach((k) => localStorage.removeItem(k));
            invalidateDedupeKey();
        }
    } catch {
        // Silencia erro em ambientes restritos
    }
}

/**
 * Busca dados de uma rota API com cache via localStorage.
 * Se já existir dado cacheado (e não expirado por TTL), retorna imediatamente sem fazer requisição.
 * Caso contrário, faz o GET e armazena o resultado para futuras chamadas.
 * Erros de rede HTTP propagam a rejeição.
 *
 * @param routeName - Nome da rota.
 * @param dataToRequest - Parâmetros da rota.
 * @param keyCache - Chave do cache no localStorage (padrão: `max_cache:routeName_params`).
 * @param ttl - Tempo de vida do cache em milissegundos. Se expirado ou ttl=0, refaz a requisição.
 * @returns Os dados da API ou do cache local. Retorna null se `routeName` for vazio.
 */
export async function getCachedApi(
    routeName: RefStringOrNull,
    dataToRequest: MayBeRefData = null,
    keyCache: RefStringOrNull = null,
    ttl?: number
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
            const parsed = JSON.parse(stored);

            if (parsed && typeof parsed === 'object' && parsed.__max_ttl_entry__) {
                const isExpired = ttl !== undefined && Date.now() - parsed.timestamp >= ttl;
                if (isExpired) try {
                    localStorage.removeItem(key);
                } catch {}
                else return parsed.data;
            } else return parsed;
        } catch {
            try {
                localStorage.removeItem(key);
            } catch {
                // Silencia erro em ambientes restritos
            }
        }
    }

    return dedupeRequest(`ls:GET:${key}`, async () => {
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
            const toStore = ttl !== undefined ? { __max_ttl_entry__: true, data: data_return, timestamp: Date.now() } : data_return;
            localStorage.setItem(key, JSON.stringify(toStore));
        } catch {
            // Silencia QuotaExceededError se o localStorage estiver cheio
        }

        return data_return;
    });
}