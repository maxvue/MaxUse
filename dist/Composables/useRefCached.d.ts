import { RemovableRef } from '@vueuse/core';
export declare function useRefCached<T>(key: string, default_value: T): RemovableRef<T>;
export declare const useRefStorage: typeof useRefCached;
export declare const useCached: typeof useRefCached;
export declare const useSharedCache: typeof useRefCached;
export declare const useStorage: typeof useRefCached;
//# sourceMappingURL=useRefCached.d.ts.map