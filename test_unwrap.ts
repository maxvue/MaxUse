import { Ref, UnwrapRef } from 'vue';

export type ToRefReset<T> = T extends Ref ? T : Ref<T>;
type A = UnwrapRef<ToRefReset<{ opacity: number }>>;
let a: A;
// a.opacity;
