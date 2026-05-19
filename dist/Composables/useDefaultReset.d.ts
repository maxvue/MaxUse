import { Ref } from 'vue';
export interface DefaultResetExtends extends Ref {
    reset(): void;
    initialData: string;
    timer?: number | null;
}
export type DefaultReset<T> = [T] extends [DefaultResetExtends] ? T : Ref & {
    reset(): void;
    initialData: string;
    timer?: number | null;
};
export declare function useDefaultReset<T>(initialData: T, timer?: number | null): DefaultReset<T>;
export declare const refAutoReset: typeof useDefaultReset;
//# sourceMappingURL=useDefaultReset.d.ts.map