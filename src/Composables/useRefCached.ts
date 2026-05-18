import localforage from 'localforage';
import { watchDebounced, useStorage as vueUseStorage, type RemovableRef } from '@vueuse/core';
import type { Ref } from 'vue';

type MyRef<T> = Ref<T, T | null | undefined>;

export function useRefCached(key: string, default_value: any) {
    localforage.config({ name: 'caches', storeName: 'use-ref-storages' });

    const state = vueUseStorage(key, default_value);

    localforage.getItem(key).then((value: any) => state.value = value ? value : default_value);
    watchDebounced(state, () => localforage.setItem(key, JSON.parse(JSON.stringify(state.value))), { debounce: 600 });

    return state;
}

export const useRefStorage = useRefCached;
export const useCached = useRefCached;
export const useSharedCache = useRefCached;
export const useStorage = useRefCached;