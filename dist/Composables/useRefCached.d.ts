import { Ref } from 'vue';
type TypeCached = string | number | boolean | Record<string, any> | Array<any> | null | undefined;
export declare function useRefCached(key: string, default_value: TypeCached): Ref;
export declare const useRefStorage: typeof useRefCached;
export declare const useCached: typeof useRefCached;
export declare const useSharedCache: typeof useRefCached;
export declare const useStorage: typeof useRefCached;
export {};
//# sourceMappingURL=useRefCached.d.ts.map