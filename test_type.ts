import { Ref } from 'vue';

export interface Reset {
    reset(): void;
    initialData: string;
    timer?: number | null;
}

export type DefaultReset1<T> = ([T] extends [Ref] ? T : Ref<T>) & Reset;
export interface DefaultReset2<T> extends Ref<T>, Reset {}
export type DefaultReset3<T> = Ref<T> & Reset;

