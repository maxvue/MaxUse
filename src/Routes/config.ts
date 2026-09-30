/**
 * Type definition for the route resolver function.
 * Receives the route name and optional parameters.
 * Returns the resolved URL string or null if the route does not exist.
 */
export type RouteResolver = (name: string, params?: Record<string, any>) => string | null;

/**
 * Request headers and options configuration for HTTP requests.
 */
export interface ApiRequestConfig {
    /** Additional headers added to mutating requests (POST, PUT, DELETE, UPLOAD) */
    headers?: Record<string, string | (() => string)>;
    /** Whether to send cross-origin credentials/cookies (default: true) */
    withCredentials?: boolean;
}

let routeResolver: RouteResolver | null = null;
let apiConfig: ApiRequestConfig = { withCredentials: true };

/**
 * Cleanup callbacks registered by other modules maintaining global state.
 *
 * @internal
 */
const resetHandlers = new Set<() => void>();

/**
 * Registers a callback invoked by {@link resetConfig}.
 * @returns Unsubscribe function.
 * @internal Internal library usage.
 */
export function onResetConfig(handler: () => void): () => void {
    resetHandlers.add(handler);
    return () => {
        resetHandlers.delete(handler);
    };
}

/**
 * Configures the library route resolver function.
 * Should be called once during application bootstrap (e.g., in main.ts).
 *
 * @param resolver - Function converting route name + params into a URL string.
 *
 * @example
 * ```typescript
 * import { setRouteResolver } from '@maxvue/max-use';
 * import { route } from 'ziggy-js';
 *
 * setRouteResolver((name, params) => route(name, params));
 * ```
 */
export function setRouteResolver(resolver: RouteResolver): void {
    routeResolver = resolver;
}

/**
 * Configures global HTTP request options for the library.
 *
 * @param config - Partial configuration merged with existing config.
 *
 * @example
 * ```typescript
 * import { setApiRequestConfig } from '@maxvue/max-use';
 *
 * setApiRequestConfig({
 *     withCredentials: true,
 *     headers: {
 *         'Authorization': () => `Bearer ${getToken()}`
 *     }
 * });
 * ```
 */
export function setApiRequestConfig(config: ApiRequestConfig): void {
    apiConfig = { ...apiConfig, ...config };
}

/**
 * Resolves a route name into a URL using the configured resolver.
 * @internal
 *
 * @param name - Route name.
 * @param params - Route parameters.
 * @returns Resolved URL string.
 * @throws If route resolver is not configured or route is not found.
 */
export function resolveRoute(name: string, params?: any): string {
    if (!routeResolver) throw new Error(
        'Route resolver não configurado. Chame setRouteResolver() na inicialização da aplicação.'
    );

    const url = routeResolver(name, params);
    if (url === null) throw new Error(`Rota "${name}" não encontrada pelo resolver.`);

    return url;
}

/**
 * Checks whether a named route exists in the configured resolver.
 * @internal
 *
 * @param name - Route name.
 * @param params - Optional route parameters.
 * @returns True if route exists, false otherwise.
 */
export function hasRoute(name: string, params?: Record<string, any>): boolean {
    if (!routeResolver) return false;
    try {
        return routeResolver(name, params) !== null;
    } catch {
        return false;
    }
}

/**
 * Retorna os headers configurados globalmente, resolvendo funções dinâmicas.
 * @internal Uso interno da biblioteca.
 */
export function getConfiguredHeaders(): Record<string, string> {
    const result: Record<string, string> = {};
    if (!apiConfig.headers) return result;

    for (const [key, value] of Object.entries(apiConfig.headers)) result[key] = typeof value === 'function' ? value() : value;

    return result;
}

/**
 * Retorna se deve enviar credenciais (cookies) cross-origin.
 * @internal Uso interno da biblioteca.
 */
export function getWithCredentials(): boolean {
    return apiConfig.withCredentials ?? true;
}

/**
 * Retorna o client ID armazenado em localStorage pela convenção 'selected.client.id'.
 * Se não houver ou estiver fora do browser (SSR), retorna null.
 * @internal Uso interno da biblioteca.
 */
export function getClientId(): string | null {
    if (typeof localStorage === 'undefined') return null;
    try {
        return localStorage.getItem('selected.client.id');
    } catch {
        return null;
    }
}

/**
 * Retorna o header X-Client-Id obtido do localStorage ('selected.client.id')
 * apenas se não tiver sido sobrescrito via setApiRequestConfig.
 * @internal Uso interno da biblioteca.
 */
export function getClientIdHeader(): Record<string, string> {
    const configured = getConfiguredHeaders();
    if (configured['X-Client-Id'] !== undefined) return {};

    const clientId = getClientId();
    return clientId ? { 'X-Client-Id': clientId } : {};
}

/**
 * Reseta toda a configuração da biblioteca — resolver, opções de requisição e o
 * router registrado via `setLibraryRouter`. Útil para testes.
 *
 * ATENÇÃO: a configuração é global ao processo. Em ambientes SSR, NÃO chame
 * `setApiRequestConfig` por requisição — use funções nos headers que leiam de um
 * contexto isolado por requisição (ex.: AsyncLocalStorage), sob risco de vazar
 * credenciais entre usuários concorrentes.
 *
 * @internal
 */
export function resetConfig(): void {
    routeResolver = null;
    apiConfig = { withCredentials: true };

    for (const handler of resetHandlers) handler();
}
