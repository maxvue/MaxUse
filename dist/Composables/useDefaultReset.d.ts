import { MaybeRefOrGetter, Ref } from 'vue';
export interface DefaultResetExtends<T> extends Ref<T> {
    reset(): void;
}
export type DefaultReset<T> = [T] extends [DefaultResetExtends<T>] ? T : DefaultResetExtends<T>;
export declare function useDefaultReset<T>(defaultValue: MaybeRefOrGetter<T>, delay?: number): DefaultReset<T>;
export declare const refAutoReset: typeof useDefaultReset;
//# sourceMappingURL=useDefaultReset.d.ts.map