import { ref, type Ref, watch, computed } from 'vue';
import { apiGetRoute } from '../Routes/apiGetRoute';

export type ToRefCachedApi<T> = T extends Ref ? T : Ref<T>;

export function useCachedApi<T>(route_name: string, options: { data_get?: any; data?: any; key?: string | null; defaultValue?: T; sync?: boolean; watch?: boolean } = {}): ToRefCachedApi<T> {
    const state = ref(options.defaultValue ?? null) as ToRefCachedApi<T>;
    const key = options.key ?? route_name;

    const data = localStorage.getItem(key);

    if (data) state.value = JSON.parse(data);

    if (options.watch !== false) {
        const data_save = computed(() => JSON.stringify(state.value));

        watch(data_save, (value) => {
            localStorage.setItem(key, value);
        });
    }


    if (options.sync !== false){
        const data_get = options.data_get ?? options.data ?? {};
        apiGetRoute(route_name, data_get).then((value) => {
            if (value) {
                state.value = value;
                const cleanData = JSON.parse(JSON.stringify(value));
                localStorage.setItem(key, JSON.stringify(cleanData));
            }
        });
    }

    return state;
}

export const useRefCachedApi = useCachedApi;
export const useSharedCacheApi = useCachedApi;
export const useInCacheApi = useCachedApi;