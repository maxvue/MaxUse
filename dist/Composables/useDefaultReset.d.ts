import { Ref } from 'vue';
export interface Reset {
    reset(): void;
    initialData: string;
    timer?: number | null;
}
export interface DefaultReset<T> extends Ref<T>, Reset {
}
export declare function useDefaultReset<T>(initialData: T, timer?: number | null): DefaultReset<T>;
export declare const refAutoReset: typeof useDefaultReset;
//# sourceMappingURL=useDefaultReset.d.ts.map