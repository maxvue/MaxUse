import { Ref } from 'vue';
export interface DefaultResetExtendsA<T> extends Ref<T> {
    reset(): void;
    initialData: string;
    timer?: number | null;
}
export interface DefaultResetExtendsB<T> extends Ref<T> {
    reset(): void;
    initialData: string;
    timer?: number | null;
}
export type DefaultReset<T> = [T] extends [DefaultResetExtendsA<T>] ? T : DefaultResetExtendsB<T>;
export declare function useDefaultReset<T>(initialData: T, timer?: number | null): DefaultReset<T>;
export declare const refAutoReset: typeof useDefaultReset;
//# sourceMappingURL=useDefaultReset.d.ts.map