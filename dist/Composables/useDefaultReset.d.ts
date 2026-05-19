import { Ref } from 'vue';
export type Reset = {
    reset(): void;
    initialData: string;
    timer?: number | null;
};
export type DefaultReset<T> = ([T] extends [Ref] ? T : Ref<T>) & Reset;
export declare function useDefaultReset<T>(initialData: T, timer?: number | null): DefaultReset<T>;
export declare const refAutoReset: typeof useDefaultReset;
//# sourceMappingURL=useDefaultReset.d.ts.map