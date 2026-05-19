import { Ref } from 'vue';
export type DefaultReset<T> = ([T] extends [Ref] ? T : Ref<T>) & {
    reset(): void;
    initialData?: any;
    timer?: number | null;
};
export declare function useDefaultReset<T>(initialData: T, timer?: number | null): DefaultReset<T>;
export declare const refAutoReset: typeof useDefaultReset;
//# sourceMappingURL=useDefaultReset.d.ts.map