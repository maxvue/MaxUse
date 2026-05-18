import localforage from 'localforage';
import { watchDebounced, useStorage as vueUseStorage } from '@vueuse/core';
import { Ref } from 'vue';


export function useRefCached<T>(key: string, default_value: T): Ref<T> {
    localforage.config({ name: 'caches', storeName: 'use-ref-storages' });

    const state = vueUseStorage(key, default_value);

    localforage.getItem(key).then((value: any) => state.value = value ? value : default_value);
    watchDebounced(state, () => localforage.setItem(key, JSON.parse(JSON.stringify(state.value))), { debounce: 600 });

    return state as Ref<T>;
}

export const useRefStorage = useRefCached;
export const useCached = useRefCached;
export const useSharedCache = useRefCached;
export const useStorage = useRefCached;