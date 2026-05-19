import { ref, Ref } from 'vue';
import { ulid } from 'ulid';
import { watchDebounced } from '@vueuse/core';

export type Reset = { reset(): void; initialData: string; timer?: number | null };
export type DefaultRefReset<T> = (T extends Ref ? T : Ref<T>) & Reset;

export function useDefaultReset<T>(initialData: T, timer: number | null = null): DefaultRefReset<T> {

    const state = ref<T>(initialData) as DefaultRefReset<T>;
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
        setTimeout(() => state.reset(), timer);
    }, { debounce: timer });

    return state;
}

export const refAutoReset = useDefaultReset;
