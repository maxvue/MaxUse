import { ref, type Ref, watch, computed, toValue, type MaybeRefOrGetter, onScopeDispose, getCurrentScope } from 'vue';
import { apiGetRoute } from '../Routes/apiGetRoute';

export type ToRefCachedApi<T> = [T] extends [Ref] ? T : Ref<T>;

/**
 * Options for configuring {@link useCachedApi}.
 *
 * @template T - Expected data type.
 */
export interface UseCachedApiOptions<T> {
    /** Parameters or query payload passed to the route resolver and GET request (alias of `data`). */
    data_get?: MaybeRefOrGetter<Record<string, unknown> | unknown>;
    /** Parameters or query payload passed to the route resolver and GET request. */
    data?: MaybeRefOrGetter<Record<string, unknown> | unknown>;
    /** Custom localStorage key. Defaults to route name when omitted. */
    key?: MaybeRefOrGetter<string | null | undefined>;
    /** Fallback initial value before network/cache resolves. */
    defaultValue?: T;
    /** Whether to synchronize state into localStorage (default: true). */
    sync?: boolean;
    /** Whether to watch dynamic route/parameters and refetch automatically (default: true). */
    watch?: boolean;
}

/**
 * Creates a reactive Ref with localStorage cache that synchronizes automatically with an API GET route.
 * On first invocation, reads from local cache (if available) while firing a background request to revalidate.
 *
 * @template T - Response data type.
 * @param route_name - Route name or getter for the GET request.
 * @param options - Configuration options.
 * @returns A reactive Ref containing cached or fresh API data.
 * @example
 * ```typescript
 * const users = useCachedApi<User[]>('api.users.index', {
 *   defaultValue: [],
 *   data_get: { active: true },
 *   key: 'users-cache'
 * });
 * console.log(users.value); // Reactive Ref value
 * ```
 */
export function useCachedApi<T = any>(
    route_name: MaybeRefOrGetter<string | null | undefined>,
    options: UseCachedApiOptions<T> = {}
): ToRefCachedApi<T> {
    const cloneDefault = (): T =>
        (typeof options.defaultValue === 'object' && options.defaultValue !== null)
            ? structuredClone(options.defaultValue)
            : (options.defaultValue ?? null) as T;

    const state = ref<T>(cloneDefault()) as ToRefCachedApi<T>;

    const is_client = typeof localStorage !== 'undefined';
    let disposed = false;
    let active_controller: AbortController | null = null;

    if (getCurrentScope()) onScopeDispose(() => {
        disposed = true;
        active_controller?.abort();
        active_controller = null;
    });


    const targetRoute = computed(() => toValue(route_name));
    const targetKey = computed(() => {
        const k = toValue(options.key);
        const r = targetRoute.value;
        return k !== undefined ? (k ?? 'no-key') : (r ?? 'no-key');
    });
    const targetParams = computed(() => toValue(options.data_get) ?? toValue(options.data) ?? {});

    const saveToStorage = (k: string, val: any) => {
        if (!is_client || !k || k === 'no-key') return;
        const serialized = JSON.stringify(val);
        try {
            if (serialized === undefined) localStorage.removeItem(k);
            else localStorage.setItem(k, serialized);

        } catch {
            // Silencia QuotaExceededError
        }
    };

    // Leitura inicial do cache baseada em targetKey
    watch(
        targetKey,
        (currentKey) => {
            if (!is_client || !currentKey || currentKey === 'no-key') return;
            const data = localStorage.getItem(currentKey);
            if (data) try {
                state.value = JSON.parse(data);
            } catch {
                localStorage.removeItem(currentKey);
                state.value = cloneDefault();
            }
            else state.value = cloneDefault();

        },
        { immediate: true }
    );

    // Watcher de gravação no localStorage
    if (options.watch !== false) watch(
        state,
        (new_val) => {
            if (disposed) return;
            saveToStorage(targetKey.value, new_val);
        },
        { deep: true }
    );


    let request_id = 0;

    // Sincronização com a API (com suporte a parâmetros reativos e resposta tardia descartada)
    if (options.sync !== false) watch(
        [targetRoute, targetParams],
        async ([rName, pData]) => {
            if (!rName || disposed) return;
            const my_id = ++request_id;

            // Aborta a requisição anterior: além da guarda por request_id (que descarta
            // o resultado fora de ordem), evita pagar o custo de rede da chamada obsoleta.
            active_controller?.abort();
            const controller = new AbortController();
            active_controller = controller;

            try {
                const value = await apiGetRoute(rName, pData, { signal: controller.signal });
                if (disposed || my_id !== request_id || value == null) return;
                state.value = value;
                if (is_client && options.watch === false && targetKey.value && targetKey.value !== 'no-key') saveToStorage(targetKey.value, value);

            } catch {
                // apiGetRoute já registra o erro; mantém o valor vindo do cache
            }
        },
        { immediate: true }
    );


    return state;
}

/** Alias for {@link useCachedApi}. */
export const useRefCachedApi = useCachedApi;
/** Alias for {@link useCachedApi}. */
export const useSharedCacheApi = useCachedApi;
/** Alias for {@link useCachedApi}. */
export const useInCacheApi = useCachedApi;