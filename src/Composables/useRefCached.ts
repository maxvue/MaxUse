import { watchDebounced } from '@vueuse/core';
import { ref, Ref, toValue, type MaybeRefOrGetter, computed, watch } from 'vue';

export type ToRefCached<T> = [T] extends [Ref] ? T : Ref<T>;
type KeyCached = MaybeRefOrGetter<string | number | null | undefined>;

export function useRefCached<T>(key: KeyCached, default_value: T): ToRefCached<T> {
    const raw_key = computed(() => toValue(key));

    const state = ref<T>(default_value) as ToRefCached<T>;

    watch(raw_key, () => {

        if (!raw_key) return;

        // Leitura síncrona do localStorage
        const raw = localStorage.getItem(String(raw_key.value));
        if (raw !== null) {
            try {
                state.value = JSON.parse(raw);
            } catch {
                state.value = default_value;
            }
        }

        watchDebounced(state, () => localStorage.setItem(String(raw_key), JSON.stringify(state.value)), { debounce: 600, deep: true });
    }, { immediate: true });

    return state;
}

export const useRefStorage = useRefCached;
export const useCached = useRefCached;
export const useSharedCache = useRefCached;
export const useStorage = useRefCached;