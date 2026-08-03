import { resolveRoute } from './config';

/**
 * Resolve uma rota nomeada e prepara opções auxiliares para requisições HTTP.
 * Função base usada internamente por `apiGetRoute`, `apiPostRoute`, `apiPutRoute` e `apiDeleteRoute`.
 *
 * @param RouteName - Nome da rota (ex: 'api.usuarios.index').
 * @param data - Parâmetros da rota (substituídos na URL para GET, ignorados para outros métodos).
 * @param options - Opções extras (ex: `{ load_screen: true }`).
 * @param method - Método HTTP ('GET', 'POST', 'PUT', 'DELETE'). Padrão: 'GET'.
 * @returns Objeto com `routeURL` e `option_load_screen`, ou null se `RouteName` for falsy.
 */
export function apiRoute(RouteName: string | null, data: any | null = null, options: any = null, method = 'GET') {
    if (!RouteName) return null;

    const option_load_screen = options?.load_screen ?? null;

    const routeURL: string = method === 'GET' ? resolveRoute(RouteName, data) : resolveRoute(RouteName);

    const apiHelper = {
        option_load_screen,
        routeURL
    };

    return apiHelper;
}
