import { ref, Ref } from 'vue';
import { ulid } from 'ulid';
import { watchDebounced } from '@vueuse/core';

export interface DefaultResetExtends<T> extends Ref<T> { reset(): void; initialData: string; timer?: number | null };
export type DefaultReset<T> = [T] extends [DefaultResetExtends<T>] ? T : DefaultResetExtends<T> | null;

export function useDefaultReset<T>(initialData: T, timer: number | null = null): DefaultReset<T> {

    const state = ref<T>(initialData) as DefaultReset<T>;

    if (!state) return state;

    state.initialData = JSON.stringify(initialData);

    state.reset = () => {
        const reset_data = JSON.parse(state.initialData);

        if (typeof reset_data === 'object') for (const k in reset_data){
            if (reset_data[k] === 'ulid') reset_data[k] = ulid().toLowerCase();
            if (reset_data[k] === 'now') reset_data[k] = new Date().toISOString();
        }

        state.value = reset_data;
    };

    state.reset();
    state.timer = timer;

    if (timer) watchDebounced(state, () => {
        state.reset();
    }, { debounce: timer });

    return state as DefaultReset<T>;
}

export const refAutoReset = useDefaultReset;
