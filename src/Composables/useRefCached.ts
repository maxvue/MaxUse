import { ref, Ref, toValue, type MaybeRefOrGetter, computed, watch } from 'vue';

export type ToRefCached<T> = [T] extends [Ref] ? T : Ref<T>;
type KeyCached = MaybeRefOrGetter<string | number | null | undefined>;

export function useRefCached<T>(key: KeyCached, default_value: T): ToRefCached<T> {
    const raw_key = computed(() => toValue(key));

    const state = ref<T>(default_value) as ToRefCached<T>;

    watch(raw_key, (new_key, old_key) => {

        if (!raw_key.value) return;

        // Leitura síncrona do localStorage
        const raw = localStorage.getItem(String(raw_key.value));
        if (raw !== null) {
            try {
                state.value = JSON.parse(raw);
            } catch {
                state.value = default_value;
            }
        }

        console.log({ Key: raw_key.value, new_key: new_key, old_key: old_key });
    }, { immediate: true });

    watch(state, (new_value, old_value) => {
        console.log({ Key: raw_key.value, old_value: old_value, new_value: new_value });
        if (!raw_key.value) return;
        localStorage.setItem(String(raw_key), JSON.stringify(new_value));
    }, { immediate: true });

    return state;
}

export const useRefStorage = useRefCached;
export const useCached = useRefCached;
export const useSharedCache = useRefCached;
export const useStorage = useRefCached;