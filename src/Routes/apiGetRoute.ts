import axios, { AxiosRequestConfig } from 'axios';
import { apiRoute } from './apiRoute';
import { getConfiguredHeaders, getWithCredentials } from './config';

/**
 * Realiza uma requisição HTTP GET para uma rota nomeada.
 * Suporta download de arquivos (blob) e tratamento de erros configurável.
 *
 * @param RouteName - Nome da rota (ex: 'api.usuarios.index').
 * @param data - Parâmetros da rota (substituídos na URL).
 * @param options - Opções extras. `{ file: true }` altera responseType para blob. `{ error: false }` silencia erros no console.
 * @returns Os dados da resposta ou null em caso de erro.
 */
export async function apiGetRoute(RouteName: string | null, data: any = {}, options: any = null): Promise<any> {
    const system_options: any = apiRoute(RouteName, data, options, 'GET');
    const config: AxiosRequestConfig = {
        responseType: 'json',
        headers: {
            ...getConfiguredHeaders()
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
        if (options?.error !== false) console.error('>> Request ERRO - URL: "' + system_options.routeURL + '"', error?.message);

        return null;
    }
}