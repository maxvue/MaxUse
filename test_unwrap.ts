import { Ref, UnwrapRef } from 'vue';

export interface Reset {
    reset(): void;
    initialData: string;
    timer?: number | null;
}
export interface DefaultReset<T> extends Ref<T>, Reset {}

type MyValue = { top: number; opacity: number };
type Test = UnwrapRef<DefaultReset<MyValue>>;

let a: Test;
a = { top: 1, opacity: 2 }; // If Test is MyValue, this works.
a.reset(); // If Test is unwrapped, it shouldn't have reset().
