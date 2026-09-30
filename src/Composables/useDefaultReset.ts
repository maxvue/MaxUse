import { ref, nextTick, type Ref } from 'vue';
import { ulid } from 'ulid';
import { watchDebounced } from '@vueuse/core';

/**
 * Return type of the {@link useDefaultReset} composable.
 * Extends a Vue Ref by attaching a `.reset()` method that restores initial data.
 *
 * @template T - The type of value stored in the Ref.
 */
export type DefaultReset<T> = ([T] extends [Ref] ? T : Ref<T>) & {
    reset(): void;
    initialData?: T;
    timer?: number | null;
};

function cloneInitialData<T>(data: T): T {
    if (data === undefined) return undefined as T;
    try {
        return structuredClone(data);
    } catch {
        try {
            return JSON.parse(JSON.stringify(data));
        } catch {
            return data;
        }
    }
}

/**
 * Creates a reactive Ref with the ability to reset to its initial value.
 * Optionally resets automatically after a period of inactivity (debounced auto-reset).
 * Ideal for forms, transient UI states, and values that must restore defaults.
 *
 * Special initialData behaviors:
 * - If `initialData.id === 'ulid'`, generates a new fresh ULID upon each reset.
 * - If `initialData.created_at === 'now'`, assigns the current date upon each reset.
 *
 * @param initialData - The initial state (deep-cloned via structuredClone with JSON fallback).
 * @param timer - Milliseconds of inactivity before auto-resetting (null disables auto-reset). Default: null.
 * @returns An extended Ref equipped with a `.reset()` method.
 *
 * @example
 * ```typescript
 * const form = useDefaultReset({ name: '', email: '' });
 * form.value.name = 'John';
 * form.reset(); // Restores { name: '', email: '' }
 *
 * // Auto-resets after 3 seconds of inactivity
 * const notification = useDefaultReset('', 3000);
 * notification.value = 'Saved successfully!';
 * // 3s later → restores ''
 * ```
 */
export function useDefaultReset<T>(initialData: T, timer: number | null = null): DefaultReset<T> {
    const state = ref<T>() as DefaultReset<T>;

    state.initialData = cloneInitialData(initialData);

    state.reset = () => {
        const new_data = cloneInitialData(state.initialData);

        if (state.initialData && typeof state.initialData === 'object') {
            if ((state.initialData as any)?.id === 'ulid') (new_data as any).id = ulid().toLowerCase();
            if ((state.initialData as any)?.created_at === 'now') (new_data as any).created_at = new Date().toISOString();
        }
        state.value = new_data;
    };

    state.reset();
    state.timer = timer;

    if (typeof timer === 'number' && timer > 0) {
        const watcher = watchDebounced(
            state,
            () => {
                watcher.pause();
                state.reset();
                nextTick(() => {
                    watcher.resume();
                });
            },
            { debounce: timer, deep: true }
        );
    }

    return state as DefaultReset<T>;
}

/** Alias for {@link useDefaultReset}. */
export const refAutoReset = useDefaultReset;
