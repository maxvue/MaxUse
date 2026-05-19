import { Ref } from 'vue';
export type Reset<T> = {
    reset(): void;
    initialData: T;
    timer?: number | null;
};
export type DefaultRefReset<T> = (T extends Ref ? T : Ref<T>) & Reset<T>;
export declare function useDefaultReset<T>(initialData: T, timer?: number | null): DefaultRefReset<T>;
export declare const refAutoReset: typeof useDefaultReset;
//# sourceMappingURL=useDefaultReset.d.ts.map