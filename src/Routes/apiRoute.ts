import { useRoute } from 'ziggy-js';

/**
 * Resolve uma rota Ziggy e prepara opções auxiliares para requisições HTTP.
 * Função base usada internamente por `apiGetRoute`, `apiPostRoute`, `apiPutRoute` e `apiDeleteRoute`.
 *
 * @param RouteName - Nome da rota Ziggy (ex: 'api.usuarios.index').
 * @param data - Parâmetros da rota (substituídos na URL para GET, ignorados para outros métodos).
 * @param options - Opções extras (ex: `{ load_screen: true }`).
 * @param method - Método HTTP ('GET', 'POST', 'PUT', 'DELETE'). Padrão: 'GET'.
 * @returns Objeto com `routeURL` e `option_load_screen`, ou null se `RouteName` for falsy.
 */
export function apiRoute(RouteName: string | null, data: any | null = null, options: any = null, method = 'GET') {
    if (!RouteName) return null;

    const option_load_screen = options?.load_screen ?? null;

    const route = useRoute();
    const routeURL: string = method === 'GET' ? route(RouteName, data) : route(RouteName);

    const apiHelper = {
        option_load_screen,
        routeURL
    };

    return apiHelper;
}
