import { Ref } from 'vue';
type CachedRef<T> = Ref<T, T | null | undefined>;
export declare function useRefCached<T>(key: string, default_value: T): CachedRef<T>;
export declare const useRefStorage: typeof useRefCached;
export declare const useCached: typeof useRefCached;
export declare const useSharedCache: typeof useRefCached;
export declare const useStorage: typeof useRefCached;
export { CachedRef };
//# sourceMappingURL=useRefCached.d.ts.map