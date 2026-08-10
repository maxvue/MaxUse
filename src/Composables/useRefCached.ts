import { ref, Ref, toValue, type MaybeRefOrGetter, computed, watch, onScopeDispose, nextTick } from 'vue';

export type ToRefCached<T> = [T] extends [Ref] ? T : Ref<T>;
type KeyCached = MaybeRefOrGetter<string | number | null | undefined>;

/**
 * Cria uma Ref sincronizada com o `localStorage`, com suporte a reatividade entre abas.
 * Quando o valor muda, persiste automaticamente. Quando outra aba modifica o mesmo item,
 * sincroniza via evento nativo `storage`.
 *
 * @param key - Chave do localStorage (aceita Ref/Getter para chave dinâmica). Se null/undefined, usa 'no-key'.
 * @param default_value - Valor padrão quando a chave não existe no localStorage.
 * @returns Uma Ref reativa sincronizada com o localStorage.
 *
 * @example
 * ```typescript
 * // Persistência simples
 * const tema = useRefCached('app-tema', 'escuro');
 * tema.value = 'claro'; // salva em localStorage['app-tema']
 *
 * // Chave dinâmica baseada em ref
 * const userId = ref(42);
 * const config = useRefCached(computed(() => `config-${userId.value}`), {});
 * ```
 */
export function useRefCached<T>(key: KeyCached, default_value: T): ToRefCached<T> {
    const raw_key = computed(() => {
        const k = toValue(key);
        return k === null || k === undefined || k === '' ? 'no-key' : String(k);
    });

    const state = ref<T>(default_value) as ToRefCached<T>;

    // Em SSR/Node não há storage: retorna a Ref com o valor padrão, sem persistência
    const is_client = typeof window !== 'undefined' && typeof localStorage !== 'undefined';

    let is_syncing_from_event = false;
    let active_key: string = raw_key.value;

    // Sincronização reativa entre abas via evento nativo "storage"
    const onStorageEvent = (event: StorageEvent) => {
        if (event.key !== raw_key.value || event.storageArea !== localStorage) return;

        is_syncing_from_event = true;
        try {
            if (event.newValue !== null) try {
                state.value = JSON.parse(event.newValue);
            } catch {
                state.value = default_value;
            }
            else state.value = default_value;

        } finally {
            nextTick(() => {
                is_syncing_from_event = false;
            });
        }
    };

    if (is_client) {
        window.addEventListener('storage', onStorageEvent);
        onScopeDispose(() => window.removeEventListener('storage', onStorageEvent));
    }

    watch(raw_key, (new_key) => {
        if (!is_client) return;

        const old_key = active_key;
        active_key = new_key;

        if (old_key && old_key !== 'no-key' && old_key !== new_key && !is_syncing_from_event) try {
            localStorage.setItem(old_key, JSON.stringify(state.value));
        } catch {
            // Silencia QuotaExceededError
        }


        if (!new_key || new_key === 'no-key') return;

        const raw = localStorage.getItem(new_key);
        is_syncing_from_event = true;
        try {
            if (raw !== null) try {
                state.value = JSON.parse(raw);
            } catch {
                state.value = default_value;
            }
            else state.value = default_value;

        } finally {
            nextTick(() => {
                is_syncing_from_event = false;
            });
        }
    }, { immediate: true });

    watch(state, (new_value) => {
        if (!is_client || !active_key || active_key === 'no-key' || is_syncing_from_event) return;
        try {
            localStorage.setItem(active_key, JSON.stringify(new_value));
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