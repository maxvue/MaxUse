import localforage from 'localforage';
import { watchDebounced, useStorage as vueUseStorage, type RemovableRef } from '@vueuse/core';
import type { Ref } from 'vue';
import { ref } from 'vue';


export function useRefCached<T>(key: string, default_value: T): Ref {
    localforage.config({ name: 'caches', storeName: 'use-ref-storages' });

    const state = ref<T>();
    state.value = default_value;

    localforage.getItem(key).then((value: any) => state.value = value ? value : default_value);
    watchDebounced(state, () => localforage.setItem(key, JSON.parse(JSON.stringify(state.value))), { debounce: 600 });

    return state;
}

export const useRefStorage = useRefCached;
export const useCached = useRefCached;
export const useSharedCache = useRefCached;
export const useStorage = useRefCached;