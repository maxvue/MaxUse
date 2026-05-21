import { Ref, MaybeRefOrGetter } from 'vue';
export type ToRefCached<T> = [T] extends [Ref] ? T : Ref<T>;
type KeyCached = MaybeRefOrGetter<string | number | null | undefined>;
export declare function useRefCached<T>(key: KeyCached, default_value: T): ToRefCached<T>;
export declare const useRefStorage: typeof useRefCached;
export declare const useCached: typeof useRefCached;
export declare const useSharedCache: typeof useRefCached;
export declare const useStorage: typeof useRefCached;
export {};
//# sourceMappingURL=useRefCached.d.ts.map