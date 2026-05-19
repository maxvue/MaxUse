import { Ref } from 'vue';
export interface DefaultResetRef<T> extends Ref<T> {
    reset(): void;
    initialData?: T;
    timer?: number | null;
}
export declare function useDefaultReset<T>(initialData: T, timer?: number | null): DefaultResetRef<T>;
export declare const refAutoReset: typeof useDefaultReset;
//# sourceMappingURL=useDefaultReset.d.ts.map