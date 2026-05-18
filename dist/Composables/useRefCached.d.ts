import { Ref } from 'vue';
type RefCached<T> = T | null | undefined | Ref<T, T | null | undefined>;
export declare function useRefCached<T>(key: string, default_value: T): RefCached<T>;
export declare const useRefStorage: typeof useRefCached;
export declare const useCached: typeof useRefCached;
export declare const useSharedCache: typeof useRefCached;
export declare const useStorage: typeof useRefCached;
export {};
//# sourceMappingURL=useRefCached.d.ts.map