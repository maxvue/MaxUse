import { Ref } from 'vue';
export declare function useCachedApi<T>(route_name: string, options?: {
    data_get?: any;
    data?: any;
    key?: string | null;
    defaultValue?: any;
    sync?: boolean;
    watch?: boolean;
}): Ref<T | null>;
export declare const useRefCachedApi: typeof useCachedApi;
export declare const useSharedCacheApi: typeof useCachedApi;
export declare const useInCacheApi: typeof useCachedApi;
//# sourceMappingURL=useRefCached.d.ts.map