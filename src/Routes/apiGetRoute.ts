import axios, { AxiosRequestConfig } from 'axios';
import { apiRoute, type ApiRouteOptions } from './apiRoute';
import { getConfiguredHeaders, getWithCredentials } from './config';

/**
 * Realiza uma requisição HTTP GET para uma rota nomeada.
 * Suporta download de arquivos (blob) e tratamento de erros configurável.
 *
 * @template T - Tipo do payload de retorno da API.
 * @param RouteName - Nome da rota (ex: 'api.usuarios.index').
 * @param data - Parâmetros da rota (substituídos na URL).
 * @param options - Opções extras (onError, throw, file, error, load_screen).
 * @returns Os dados da resposta ou null em caso de erro.
 */
export async function apiGetRoute<T = any>(
    RouteName: string | null | undefined,
    data: any = {},
    options: ApiRouteOptions | null = null
): Promise<T | null> {
    const system_options = apiRoute(RouteName, data, options, 'GET');

    if (!system_options) return null;

    const config: AxiosRequestConfig = {
        responseType: 'json',
        headers: {
            ...getConfiguredHeaders(),
            ...options?.headers
        },
        withCredentials: getWithCredentials()
    };
    if (typeof localStorage !== 'undefined') {
        const clientId = localStorage.getItem('selected.client.id');
        if (clientId && config.headers) (config.headers as Record<string, string>)['X-Client-Id'] = clientId;
    }

    if (options?.file === true) config.responseType = 'blob';

    try {
        const response = await axios.get(system_options.routeURL, config);
        return response.data;
    } catch (error: any) {
        if (options?.onError) options.onError(error);
        if (options?.error !== false) console.error('>> Request ERRO - URL: "' + system_options.routeURL + '"', error?.message);
        if (options?.throw) throw error;

        return null;
    }
}