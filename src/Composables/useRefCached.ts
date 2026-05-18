import localforage from 'localforage';
import { watchDebounced } from '@vueuse/core';
import { ref, Ref } from 'vue';

export type ToRefCached<T> = T extends Ref ? T : Ref<T>;


export function useRefCached<T>(key: string, default_value: T): ToRefCached<T> {
    localforage.config({ name: 'caches', storeName: 'use-ref-storages' });

    const state = ref(default_value) as ToRefCached<T>;

    localforage.getItem(key).then((value: any) => state.value = value ? value : default_value);
    watchDebounced(state, () => localforage.setItem(key, JSON.parse(JSON.stringify(state.value))), { debounce: 600 });

    return state;
}

export const useRefStorage = useRefCached;
export const useCached = useRefCached;
export const useSharedCache = useRefCached;
export const useStorage = useRefCached;