import { MaybeRefOrGetter, Ref } from 'vue';
export type ToRefReset<T> = T extends Ref ? T : Ref<T>;
export declare function useDefaultReset<T>(defaultValue: MaybeRefOrGetter<T>, delay?: number): ToRefReset<T>;
export declare const refAutoReset: typeof useDefaultReset;
//# sourceMappingURL=useDefaultReset.d.ts.map