import { ref, Ref } from 'vue';
import { ulid } from 'ulid';
import { watchDebounced } from '@vueuse/core';

export type Reset = { reset(): void; initialData: any; timer?: number | null };
export type DefaultRefReset<T> = (T extends Ref ? T : Ref<T>) & Reset;

export function useDefaultReset<T>(initialData: T, timer: number | null = null): DefaultRefReset<T> {

    const state = ref<T>() as DefaultRefReset<T>;
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

    if (timer) watchDebounced(state, () => {
        setTimeout(() => state.reset(), timer);
    }, { debounce: timer });

    return state;
}

export const refAutoReset = useDefaultReset;
