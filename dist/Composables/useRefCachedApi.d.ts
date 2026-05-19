import { Ref } from 'vue';
export type ToRefCachedApi<T> = T extends Ref ? T : Ref<T>;
export declare function useCachedApi<T>(route_name: string, options?: {
    data_get?: any;
    data?: any;
    key?: string | null;
    defaultValue?: T;
    sync?: boolean;
    watch?: boolean;
}): ToRefCachedApi<T>;
export declare const useRefCachedApi: typeof useCachedApi;
export declare const useSharedCacheApi: typeof useCachedApi;
export declare const useInCacheApi: typeof useCachedApi;
//# sourceMappingURL=useRefCachedApi.d.ts.map