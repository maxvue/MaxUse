import { resolveRoute } from './config';

/**
 * Opções para configuração e comportamento das requisições via `api*Route`.
 */
export interface ApiRouteOptions {
    /** Exibe tela de carregamento global */
    load_screen?: boolean;
    /** Trata a resposta como download de arquivo (blob) no GET */
    file?: boolean;
    /** Se false, silencia o log de erro no console */
    error?: boolean;
    /** Parâmetros da URL da rota em métodos de mutação (POST, PUT, DELETE, UPLOAD) */
    route_params?: Record<string, any>;
    /** Callback para capturar o objeto de erro Axios completo (status HTTP, 422, etc) */
    onError?: (error: unknown) => void;
    /** Callback de progresso do upload */
    onUploadProgress?: (progressEvent: any) => void;
    /** Se true, lança/repropaga a exceção em caso de falha HTTP */
    throw?: boolean;
    /** Headers extras para a requisição */
    headers?: Record<string, string>;
    [key: string]: any;
}

export interface ApiRouteResult {
    option_load_screen: boolean | null;
    routeURL: string;
}

/**
 * Resolve uma rota nomeada e prepara opções auxiliares para requisições HTTP.
 * Função base usada internamente por `apiGetRoute`, `apiPostRoute`, `apiPutRoute` e `apiDeleteRoute`.
 *
 * @param RouteName - Nome da rota (ex: 'api.usuarios.index').
 * @param data - Parâmetros da rota (substituídos na URL para GET).
 * @param options - Opções extras (ex: `{ load_screen: true, route_params: { id: 1 } }`).
 * @param method - Método HTTP ('GET', 'POST', 'PUT', 'DELETE'). Padrão: 'GET'.
 * @returns Objeto com `routeURL` e `option_load_screen`, ou null se `RouteName` for falsy.
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
