import { ref, type Ref, watch, computed, toValue, type MaybeRefOrGetter, onScopeDispose, getCurrentScope } from 'vue';
import { apiGetRoute } from '../Routes/apiGetRoute';

export type ToRefCachedApi<T> = [T] extends [Ref] ? T : Ref<T>;

export interface UseCachedApiOptions<T> {
    data_get?: MaybeRefOrGetter<Record<string, unknown> | unknown>;
    data?: MaybeRefOrGetter<Record<string, unknown> | unknown>;
    key?: MaybeRefOrGetter<string | null | undefined>;
    defaultValue?: T;
    sync?: boolean;
    watch?: boolean;
}

/**
 * Cria uma Ref com cache local (localStorage) que sincroniza automaticamente com uma rota de API (GET).
 * Na primeira chamada, carrega do cache local (se existir) e dispara a requisição em background para atualizar.
 *
 * @template T - Tipo dos dados retornados.
 * @param route_name - Nome da rota para a requisição GET (aceita Ref/Getter).
 * @param options - Opções de configuração.
 * @returns Uma Ref reativa com os dados da API/cache.
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

    if (getCurrentScope()) onScopeDispose(() => {
        disposed = true;
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
            try {
                const value = await apiGetRoute(rName, pData);
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

/** Alias de {@link useCachedApi}. */
export const useRefCachedApi = useCachedApi;
/** Alias de {@link useCachedApi}. */
export const useSharedCacheApi = useCachedApi;
/** Alias de {@link useCachedApi}. */
export const useInCacheApi = useCachedApi;