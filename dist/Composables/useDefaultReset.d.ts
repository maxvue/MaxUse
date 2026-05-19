import { Ref } from 'vue';
export type Reset = {
    reset(): void;
    initialData: any;
    timer?: number | null;
};
export type DefaultRefReset<T> = T extends Ref ? T & Reset : Ref & Reset;
export declare function useDefaultReset<T>(initialData: T, timer?: number | null): DefaultRefReset<T>;
export declare const refAutoReset: typeof useDefaultReset;
//# sourceMappingURL=useDefaultReset.d.ts.map