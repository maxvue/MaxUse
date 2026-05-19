import { Ref } from 'vue';
export interface DefaultReset<T> extends Ref {
    reset(): void;
    initialData?: T;
    timer?: number | null;
}
export type DefaultResetRef<T> = T extends DefaultReset<T> ? T : DefaultReset<T>;
export declare function useDefaultReset<T>(initialData: T, timer?: number | null): DefaultResetRef<T>;
export declare const refAutoReset: typeof useDefaultReset;
//# sourceMappingURL=useDefaultReset.d.ts.map