import { watchDebounced } from '@vueuse/core';
import { ref, Ref } from 'vue';

export type ToRefCached<T> = T extends Ref ? T : Ref<T>;

export function useRefCached<T>(key: string, default_value: T): ToRefCached<T> {
    const state = ref(default_value) as ToRefCached<T>;

    // Leitura síncrona do localStorage
    const raw = localStorage.getItem(key);
    if (raw !== null) try {
        state.value = JSON.parse(raw);
    } catch {
        state.value = default_value;
    }

    watchDebounced(state, () => localStorage.setItem(key, JSON.stringify(state.value)), { debounce: 600, deep: true });

    return state;
}

export const useRefStorage = useRefCached;
export const useCached = useRefCached;
export const useSharedCache = useRefCached;
export const useStorage = useRefCached;