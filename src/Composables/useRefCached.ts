import localforage from 'localforage';
import { watchDebounced, useStorage as vueUseStorage, type RemovableRef } from '@vueuse/core';
import { Ref } from 'vue';
import { ref } from 'vue';

type TypeCached = string | number | boolean | Record<string, any> | Array<any> | null | undefined;

export function useRefCached(key: string, default_value: TypeCached): Ref {
    localforage.config({ name: 'caches', storeName: 'use-ref-storages' });

    const state: Ref<TypeCached> = ref(default_value);

    localforage.getItem(key).then((value: any) => state.value = value ? value : default_value);
    watchDebounced(state, () => localforage.setItem(key, JSON.parse(JSON.stringify(state.value))), { debounce: 600 });

    return state as Ref<TypeCached>;
}

export const useRefStorage = useRefCached;
export const useCached = useRefCached;
export const useSharedCache = useRefCached;
export const useStorage = useRefCached;