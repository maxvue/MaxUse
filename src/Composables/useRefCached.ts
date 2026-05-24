import { ref, Ref, toValue, type MaybeRefOrGetter, computed, watch, onScopeDispose } from 'vue';

export type ToRefCached<T> = [T] extends [Ref] ? T : Ref<T>;
type KeyCached = MaybeRefOrGetter<string | number | null | undefined>;

export function useRefCached<T>(key: KeyCached, default_value: T): ToRefCached<T> {
    const raw_key = computed(() => toValue(key) ? String(toValue(key)) : 'no-key');

    const state = ref<T>(default_value) as ToRefCached<T>;

    // Sincronização reativa entre abas via evento nativo "storage"
    const onStorageEvent = (event: StorageEvent) => {
        if (event.key !== raw_key.value || event.storageArea !== localStorage) return;

        if (event.newValue !== null) {
            try {
                state.value = JSON.parse(event.newValue);
            } catch {
                state.value = default_value;
            }
        } else state.value = default_value;


    };

    window.addEventListener('storage', onStorageEvent);
    onScopeDispose(() => window.removeEventListener('storage', onStorageEvent));

    watch(raw_key, () => {

        if (!raw_key.value) return;

        // Leitura síncrona do localStorage
        const raw = localStorage.getItem(raw_key.value);
        if (raw !== null) {
            try {
                state.value = JSON.parse(raw);
            } catch {
                state.value = default_value;
            }
            return;
        }

        state.value = default_value;

    }, { immediate: true });

    watch(state, (new_value) => {
        if (!raw_key.value) return;
        localStorage.setItem(raw_key.value, JSON.stringify(new_value));
    }, { immediate: true, deep: true });

    return state;
}

export const useRefStorage = useRefCached;
export const useCached = useRefCached;
export const useSharedCache = useRefCached;
export const useStorage = useRefCached;