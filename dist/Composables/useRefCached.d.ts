import { Ref } from 'vue';
export interface Cachest<T> extends Ref<T> {
}
export declare function useRefCached<T>(key: string, default_value: T): Cachest<T>;
export declare const useRefStorage: typeof useRefCached;
export declare const useCached: typeof useRefCached;
export declare const useSharedCache: typeof useRefCached;
export declare const useStorage: typeof useRefCached;
//# sourceMappingURL=useRefCached.d.ts.map