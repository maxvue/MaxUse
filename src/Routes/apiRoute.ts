import { resolveRoute } from './config';

/**
 * Options configuring behavior for `api*Route` helpers.
 */
export interface ApiRouteOptions {
    /** Whether to trigger global loading screen */
    load_screen?: boolean;
    /** Treat response as file download (blob) in GET requests */
    file?: boolean;
    /** If false, silences console error logging */
    error?: boolean;
    /** URL placeholder route parameters for mutating methods (POST, PUT, DELETE, UPLOAD) */
    route_params?: Record<string, any>;
    /** Callback capturing complete Axios error object (HTTP status, 422 validation, etc.) */
    onError?: (error: unknown) => void;
    /** Upload progress event callback */
    onUploadProgress?: (progressEvent: any) => void;
    /** If true, rethrows error on HTTP failure instead of returning null/false */
    throw?: boolean;
    /** Extra HTTP headers */
    headers?: Record<string, string>;
    /** AbortSignal for request cancellation */
    signal?: AbortSignal;
    [key: string]: any;
}

/**
 * Result returned by the internal {@link apiRoute} resolver helper.
 */
export interface ApiRouteResult {
    option_load_screen: boolean | null;
    routeURL: string;
}

/**
 * Resolves a named route into a URL and extracts helper options.
 * Base resolver function used internally by `apiGetRoute`, `apiPostRoute`, `apiPutRoute`, and `apiDeleteRoute`.
 *
 * @param RouteName - Named route string (e.g. 'api.users.index').
 * @param data - Route parameters (for GET) or payload.
 * @param options - Additional options (e.g. `{ load_screen: true, route_params: { id: 1 } }`).
 * @param method - HTTP method ('GET', 'POST', 'PUT', 'DELETE'). Default: 'GET'.
 * @returns Object containing `routeURL` and `option_load_screen`, or null if RouteName is blank.
 */
export function apiRoute(
    RouteName: string | null | undefined,
    data: any | null = null,
    options: ApiRouteOptions | null = null,
    method = 'GET'
): ApiRouteResult | null {
    if (!RouteName) return null;

    const option_load_screen = options?.load_screen ?? null;

    let routeURL: string;
    if (method === 'GET') routeURL = resolveRoute(RouteName, data);
    else if (options?.route_params !== undefined) routeURL = resolveRoute(RouteName, options.route_params);
    else {
        const route_params = data && typeof data === 'object' && !(data instanceof FormData) ? data : undefined;
        try {
            routeURL = route_params !== undefined ? resolveRoute(RouteName, route_params) : resolveRoute(RouteName);
        } catch {
            routeURL = resolveRoute(RouteName);
        }
    }

    return {
        option_load_screen,
        routeURL
    };
}
