import { ref, Ref, toValue, type MaybeRefOrGetter, computed, watch, onScopeDispose, getCurrentScope, nextTick } from 'vue';

export type ToRefCached<T> = [T] extends [Ref] ? T : Ref<T>;
type KeyCached = MaybeRefOrGetter<string | number | null | undefined>;

const NO_KEY = Symbol('no-key');

/**
 * Creates a reactive Ref synchronized with `localStorage`, supporting cross-tab synchronization.
 * Automatically saves on value change. When another browser tab updates the same item,
 * synchronizes state via native `storage` events.
 *
 * @param key - localStorage key (supports Ref/Getter for dynamic keys). If null, undefined or empty string, persistence is disabled and operates only in memory.
 * @param default_value - Default fallback value when key does not exist in localStorage.
 * @returns A reactive Ref synchronized with localStorage.
 *
 * @example
 * ```typescript
 * // Simple persistence
 * const theme = useRefCached('app-theme', 'dark');
 * theme.value = 'light'; // Persisted to localStorage['app-theme']
 *
 * // Dynamic key based on a ref
 * const userId = ref(42);
 * const config = useRefCached(computed(() => `config-${userId.value}`), {});
 * ```
 */
export function useRefCached<T>(key: KeyCached, default_value: T): ToRefCached<T> {
    const raw_key = computed<string | typeof NO_KEY>(() => {
        const k = toValue(key);
        return k === null || k === undefined || k === '' ? NO_KEY : String(k);
    });

    const cloneDefault = (): T =>
        (typeof default_value === 'object' && default_value !== null)
            ? structuredClone(default_value)
            : default_value;

    const state = ref<T>(cloneDefault()) as ToRefCached<T>;

    // Em SSR/Node não há storage: retorna a Ref com o valor padrão, sem persistência
    const is_client = typeof window !== 'undefined' && typeof localStorage !== 'undefined';

    let is_syncing_from_event = false;
    let last_synced_serialized: string | null = null;
    let active_key: string | typeof NO_KEY = raw_key.value;

    // Sincronização reativa entre abas via evento nativo "storage"
    const onStorageEvent = (event: StorageEvent) => {
        if (event.key !== raw_key.value || event.storageArea !== localStorage) return;

        is_syncing_from_event = true;
        try {
            if (event.newValue !== null) try {
                state.value = JSON.parse(event.newValue);
            } catch {
                state.value = cloneDefault();
            }
            else state.value = cloneDefault();

            last_synced_serialized = JSON.stringify(state.value);
        } finally {
            nextTick(() => {
                is_syncing_from_event = false;
            });
        }
    };

    if (is_client) {
        window.addEventListener('storage', onStorageEvent);
        if (getCurrentScope()) onScopeDispose(() => window.removeEventListener('storage', onStorageEvent));
    }

    watch(raw_key, (new_key) => {
        if (!is_client) return;

        const old_key = active_key;
        active_key = new_key;

        if (old_key && old_key !== NO_KEY && old_key !== new_key && !is_syncing_from_event) try {
            localStorage.setItem(old_key as string, JSON.stringify(state.value));
        } catch {
            // Silencia QuotaExceededError
        }


        if (!new_key || new_key === NO_KEY) return;

        const raw = localStorage.getItem(new_key as string);
        is_syncing_from_event = true;
        try {
            if (raw !== null) try {
                state.value = JSON.parse(raw);
            } catch {
                state.value = cloneDefault();
            }
            else state.value = cloneDefault();

        } finally {
            nextTick(() => {
                is_syncing_from_event = false;
            });
        }
    }, { immediate: true });

    watch(state, (new_value) => {
        if (!is_client || !active_key || active_key === NO_KEY) return;
        const serialized = JSON.stringify(new_value);
        if (serialized === last_synced_serialized) {
            last_synced_serialized = null;
            return;
        }
        last_synced_serialized = null;
        try {
            localStorage.setItem(active_key as string, serialized);
        } catch {
            // Silencia QuotaExceededError
        }
    }, { deep: true });

    return state;
}

/** Alias de {@link useRefCached}. */
export const useRefStorage = useRefCached;
/** Alias de {@link useRefCached}. */
export const useCached = useRefCached;
/** Alias de {@link useRefCached}. */
export const useSharedCache = useRefCached;
/** Alias de {@link useRefCached}. */
export const useStorage = useRefCached;