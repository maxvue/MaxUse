import { toValue, type MaybeRefOrGetter } from 'vue';
import axios, { AxiosRequestConfig } from 'axios';
import { useRoute } from 'ziggy-js';
import { hasContent, isBlank } from '../Helpers/Types';

type RefStringOrNull = MaybeRefOrGetter<string | null | undefined>;
type MayBeRefData = MaybeRefOrGetter<any>;

/**
 * Busca dados de uma rota API com cache via localStorage.
 * Se já existir dado cacheado, retorna imediatamente sem fazer requisição.
 * Caso contrário, faz o GET e armazena o resultado para futuras chamadas.
 *
 * @param routeName - Nome da rota Ziggy.
 * @param dataToRequest - Parâmetros da rota.
 * @param keyCache - Chave do cache no localStorage (padrão: `routeName_params`).
 * @returns Os dados da API ou do cache local. Retorna null se `routeName` for vazio.
 */
export async function getCachedApi(routeName: RefStringOrNull, dataToRequest: MayBeRefData = null, keyCache: RefStringOrNull = null ): Promise<any> {

    const route_name = toValue(routeName);

    if (!hasContent(route_name)) return null;

    const data_request = toValue(dataToRequest) ?? {};

    const key = toValue(keyCache) ?? route_name + '_' + JSON.stringify(data_request);

    const data = localStorage.getItem(key);

    if (data) return JSON.parse(data);

    const route = useRoute();
    const routeUrl = route(String(route_name), data_request);

    const config: AxiosRequestConfig = { responseType: 'json' };
    axios.defaults.withCredentials = true;
    const response = await axios.get(routeUrl, config);
    const data_return = response.data;
    console.log({ key: key, return: data_return });
    localStorage.setItem(key, JSON.stringify(data_return));
    return data_return;
}