import axios, { AxiosRequestConfig } from 'axios';
import { apiRoute, type ApiRouteOptions } from './apiRoute';
import { getConfiguredHeaders, getWithCredentials } from './config';
import { isAbortError } from './internal/abortUtils';

/**
 * Performs an HTTP GET request to a named route.
 * Supports file downloads (blob) and configurable error handling / throwing.
 *
 * @template T - Expected API response payload type.
 * @param RouteName - Named route string (e.g. 'api.users.index').
 * @param data - Route parameters substituted into the URL or query parameters.
 * @param options - Extra options (onError, throw, file, error, load_screen, signal).
 * @returns The response data, or null on error / cancellation.
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
        withCredentials: getWithCredentials(),
        ...(options?.signal ? { signal: options.signal } : {})
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
        // Cancelamento não é erro: não loga, não chama onError
        if (isAbortError(error)) {
            if (options?.throw) throw error;

            return null;
        }

        if (options?.onError) options.onError(error);
        if (options?.error !== false) console.error('>> Request ERRO - URL: "' + system_options.routeURL + '"', error?.message);
        if (options?.throw) throw error;

        return null;
    }
}