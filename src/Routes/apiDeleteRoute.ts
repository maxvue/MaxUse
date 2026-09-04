import axios from 'axios';
import { apiRoute, type ApiRouteOptions } from './apiRoute';
import { getConfiguredHeaders, getWithCredentials } from './config';
import { isAbortError } from './internal/abortUtils';

/**
 * Realiza uma requisição HTTP DELETE para uma rota nomeada.
 * Inclui automaticamente os headers configurados via `setApiRequestConfig`.
 *
 * @template T - Tipo do payload de retorno da API.
 * @param RouteName - Nome da rota (ex: 'api.usuarios.destroy').
 * @param data - Corpo da requisição (enviado no campo `data` do axios.delete).
 * @param options - Opções extras passadas para `apiRoute` (incluindo `route_params`, `onError`, `throw`).
 * @returns Os dados da resposta ou null em caso de erro. Retorna false se a rota for inválida.
 */
export async function apiDeleteRoute<T = any>(
    RouteName: string | null | undefined,
    data: any | null = null,
    options: ApiRouteOptions | null = null
): Promise<T | null | false> {
    const system_options = apiRoute(RouteName, data, options, 'DELETE');

    if (!system_options) return false;

    try {
        const response = await axios.delete(system_options.routeURL, {
            data: data,
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                ...getConfiguredHeaders(),
                ...options?.headers,
                ...(typeof localStorage !== 'undefined' && localStorage.getItem('selected.client.id') ? { 'X-Client-Id': localStorage.getItem('selected.client.id') } : {})
            },
            withCredentials: getWithCredentials(),
            ...(options?.signal ? { signal: options.signal } : {})
        });
        return response.data;
    } catch (error: any) {
        // Cancelamento não é erro: não loga, não chama onError
        if (isAbortError(error)) {
            if (options?.throw) throw error;

            return null;
        }

        if (options?.onError) options.onError(error);
        if (options?.error !== false) console.error('>> Erro ao fazer a requisição:', error);
        if (options?.throw) throw error;

        return null;
    }
}
