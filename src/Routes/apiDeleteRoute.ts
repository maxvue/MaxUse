import axios from 'axios';
import { apiRoute, type ApiRouteOptions } from './apiRoute';
import { getConfiguredHeaders, getWithCredentials } from './config';
import { isAbortError } from './internal/abortUtils';

/**
 * Performs an HTTP DELETE request to a named route.
 * Automatically injects headers configured via `setApiRequestConfig`.
 *
 * @template T - Expected API response payload type.
 * @param RouteName - Named route string (e.g. 'api.users.destroy').
 * @param data - Request body payload (passed via Axios delete `data`).
 * @param options - Extra options (use `options.route_params` for URL route placeholders, `onError`, `throw`, etc.).
 * @returns Response data, false if the route is invalid, or null on request failure.
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
