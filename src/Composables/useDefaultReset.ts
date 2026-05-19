import { ref, type Ref } from 'vue';
import { ulid } from 'ulid';
import { watchDebounced } from '@vueuse/core';

export type DefaultReset<T> = ([T] extends [Ref] ? T : Ref<T>) & {
    reset(): void;
    initialData?: any;
    timer?: number | null;
};

export function useDefaultReset<T>(initialData: T, timer: number | null = null): DefaultReset<T> {
    const state = ref<T>() as DefaultReset<T>;
    state.initialData = JSON.parse(JSON.stringify(initialData));

    state.reset = () => {
        const new_data = JSON.parse(JSON.stringify(state.initialData));
        if (typeof state.initialData === 'object') {
            if ((state.initialData as any)?.id === 'ulid') (new_data as any).id = ulid().toLowerCase();
            if ((state.initialData as any)?.created_at === 'now') (new_data as any).created_at = new Date().toISOString();
        }
        state.value = new_data;
    };

    state.reset();
    state.timer = timer;

    if (timer) {
        watchDebounced(state, () => {
            setTimeout(() => {
                state.reset();
            }, timer);
        }, { debounce: timer });
    }


    return state as DefaultReset<T>;
}

export const refAutoReset = useDefaultReset;
