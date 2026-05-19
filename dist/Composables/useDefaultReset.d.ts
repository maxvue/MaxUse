import { MaybeRefOrGetter, Ref } from 'vue';
export interface DefaultReset<T> extends Ref<T> {
}
export declare function useDefaultReset<T>(defaultValue: MaybeRefOrGetter<T>, delay?: number): DefaultReset<T>;
export declare const refAutoReset: typeof useDefaultReset;
//# sourceMappingURL=useDefaultReset.d.ts.map