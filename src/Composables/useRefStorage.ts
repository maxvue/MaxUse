import localforage from 'localforage';
import { watchDebounced, useStorage as vueUseStorage } from '@vueuse/core';

export function useCached(key: string, default_value: any = null): any {
    localforage.config({ name: 'caches', storeName: 'use-ref-storages' });

    const state = vueUseStorage(key, default_value);

    localforage.getItem(key).then((value: any) => state.value = value ? value : default_value);
    watchDebounced(state, () => localforage.setItem(key, JSON.parse(JSON.stringify(state.value))), { debounce: 600 });

    return state;
}

export const useRefStorage = useCached;
export const useRefCached = useCached;
export const useSharedCache = useCached;
export const useStorage = useCached;