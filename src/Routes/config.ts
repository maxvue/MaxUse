/**
 * Tipo para o resolvedor de rotas.
 * Recebe o nome da rota e parâmetros opcionais.
 * Retorna a URL resolvida ou null se a rota não existir.
 */
export type RouteResolver = (name: string, params?: Record<string, any>) => string | null;

/**
 * Configuração de headers e opções para requisições HTTP.
 */
export interface ApiRequestConfig {
    /** Headers extras adicionados a todas as requisições que alteram dados (POST, PUT, DELETE, UPLOAD) */
    headers?: Record<string, string | (() => string)>;
    /** Se deve enviar cookies cross-origin (padrão: true) */
    withCredentials?: boolean;
}

let routeResolver: RouteResolver | null = null;
let apiConfig: ApiRequestConfig = { withCredentials: true };

/**
 * Callbacks de limpeza registrados por outros módulos que mantêm estado global.
 * Usa registro em vez de import direto porque `goToRoute.ts` já importa deste
 * arquivo — importá-lo de volta criaria uma dependência circular.
 *
 * @internal
 */
const resetHandlers = new Set<() => void>();

/**
 * Registra um callback a ser executado por {@link resetConfig}.
 * @internal Uso interno da biblioteca.
 */
export function onResetConfig(handler: () => void): void {
    resetHandlers.add(handler);
}

/**
 * Configura o resolvedor de rotas da biblioteca.
 * Deve ser chamado uma vez na inicialização da aplicação.
 *
 * O resolvedor recebe o nome da rota e parâmetros opcionais, e retorna a URL completa.
 * Se a rota não existir, deve retornar null.
 *
 * @param resolver - Função que converte nome + params em URL.
 *
 * @example
 * ```typescript
 * import { setRouteResolver } from 'max-use';
 *
 * // Exemplo simples com base URL
 * setRouteResolver((name, params) => {
 *     const routes: Record<string, string> = {
 *         'api.usuarios.index': '/api/usuarios',
 *         'api.usuarios.show': '/api/usuarios/:id',
 *     };
 *     let url = routes[name];
 *     if (!url) return null;
 *     if (params) {
 *         for (const [key, value] of Object.entries(params)) {
 *             url = url.replace(`:${key}`, String(value));
 *         }
 *     }
 *     return url;
 * });
 * ```
 */
export function setRouteResolver(resolver: RouteResolver): void {
    routeResolver = resolver;
}

/**
 * Configura opções globais para as requisições HTTP da biblioteca.
 * Headers configurados aqui são aplicados em todas as requisições que alteram dados.
 *
 * @param config - Configuração parcial que será mesclada com a existente.
 *
 * @example
 * ```typescript
 * import { setApiRequestConfig } from 'max-use';
 *
 * // Para Adonis (CSRF via cookie é automático pelo Axios)
 * setApiRequestConfig({ withCredentials: true });
 *
 * // Para adicionar headers customizados (ex: token Bearer)
 * setApiRequestConfig({
 *     headers: {
 *         'Authorization': () => `Bearer ${getToken()}`,
 *         'X-Custom': 'valor-fixo'
 *     }
 * });
 * ```
 */
export function setApiRequestConfig(config: ApiRequestConfig): void {
    apiConfig = { ...apiConfig, ...config };
}

/**
 * Resolve uma rota pelo nome usando o resolver configurado.
 * @internal Uso interno da biblioteca.
 *
 * @param name - Nome da rota.
 * @param params - Parâmetros da rota.
 * @returns A URL resolvida.
 * @throws Se o resolver não estiver configurado ou a rota não for encontrada.
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
 * Verifica se uma rota existe no resolver configurado.
 * @internal Uso interno da biblioteca.
 *
 * @param name - Nome da rota.
 * @returns true se a rota existe, false caso contrário.
 */
export function hasRoute(name: string): boolean {
    if (!routeResolver) return false;
    try {
        return routeResolver(name) !== null;
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
