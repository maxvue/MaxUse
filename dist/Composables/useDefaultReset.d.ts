import { Ref } from 'vue';
export interface DefaultResetExtends<T> extends Ref<T> {
    reset(): void;
    initialData: string;
    timer?: number | null;
}
export type DefaultReset<T> = [T] extends [DefaultResetExtends<T>] ? T : DefaultResetExtends<T> | null;
export declare function useDefaultReset<T>(initialData: T, timer?: number | null): DefaultReset<T>;
export declare const refAutoReset: typeof useDefaultReset;
//# sourceMappingURL=useDefaultReset.d.ts.map