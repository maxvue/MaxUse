import { Ref } from 'vue';
export declare function useRefCached<T>(key: string, default_value: T): Ref<T, T | null | undefined>;
export declare const useRefStorage: typeof useRefCached;
export declare const useCached: typeof useRefCached;
export declare const useSharedCache: typeof useRefCached;
export declare const useStorage: typeof useRefCached;
//# sourceMappingURL=useRefCached.d.ts.map