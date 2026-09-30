import { watchDebounced, type WatchDebouncedOptions, whenever, type WheneverOptions } from '@vueuse/core';
import { watch, nextTick, type WatchSource, type WatchOptions, type WatchHandle } from 'vue';
import { isNotEmpty } from '../Helpers/Validations';

/** Alias for VueUse `whenever`. Invokes callback only when the source evaluates to truthy. */
export const watchTrue = whenever;

/**
 * Watcher that invokes callback only when the source value is valid (non-empty via `isNotEmpty`).
 * Ignores initial/transient null, undefined, or empty states.
 *
 * @template T - Source data type.
 * @template Immediate - Whether watcher runs immediately.
 * @param source - Reactive source to watch.
 * @param callback - Function invoked with valid non-null value and previous value.
 * @param options - Watcher options (supports `once`, `immediate`, `deep`, etc.).
 * @returns WatchHandle to manually stop the watcher.
 *
 * @example
 * ```typescript
 * const user = ref<User | null>(null);
 *
 * watchIfValid(user, (validUser) => {
 *     console.log('User loaded:', validUser.name);
 * });
 * ```
 */
export function watchIfValid<T, Immediate extends Readonly<boolean> = false>(
    source: WatchSource<T>,
    callback: (value: NonNullable<T>, oldValue: T | undefined) => void,
    options?: WheneverOptions<Immediate>
): WatchHandle {
    let fired = false;
    const handle = watch(
        source,
        (value, oldValue) => {
            if (fired || !isNotEmpty(value)) return;

            if (options?.once) {
                fired = true;
                nextTick(() => handle.stop());
            }

            callback(value as NonNullable<T>, oldValue);
        },
        { ...options, once: false } as WatchOptions
    );

    return handle;
}

/** Alias for {@link watchIfValid}. */
export const watchValid = watchIfValid;
/** Alias for {@link watchIfValid}. */
export const watchIsValid = watchIfValid;
/** Alias for {@link watchIfValid}. */
export const watchIsValidComputed = watchIfValid;
/** Alias for {@link watchIfValid}. */
export const watchComputedIsValid = watchIfValid;

/**
 * Debounced watcher that invokes callback only when the source value is valid (non-empty via `isNotEmpty`).
 * Combines VueUse `watchDebounced` with `isNotEmpty` validation.
 *
 * @template T - Source data type.
 * @template Immediate - Whether watcher runs immediately.
 * @param source - Reactive source to watch.
 * @param callback - Function invoked with valid non-null value and previous value.
 * @param options - Debounced watch options (supports `debounce`, `maxWait`, `once`, etc.).
 * @returns WatchHandle to manually stop the watcher.
 *
 * @example
 * ```typescript
 * const searchTerm = ref('');
 *
 * watchDebounceIfValid(searchTerm, (term) => {
 *     fetchUsers(term);
 * }, { debounce: 300 });
 * ```
 */
export function watchDebounceIfValid<T, Immediate extends Readonly<boolean> = false>(
    source: WatchSource<T>,
    callback: (value: NonNullable<T>, oldValue: T | undefined) => void,
    options?: WatchDebouncedOptions<Immediate>
): WatchHandle {
    let fired = false;
    const handle = watchDebounced(
        source,
        (value, oldValue) => {
            if (fired || !isNotEmpty(value)) return;

            if (options?.once) {
                fired = true;
                nextTick(() => handle.stop());
            }

            callback(value as NonNullable<T>, oldValue);
        },
        { ...options, once: false } as WatchDebouncedOptions<Immediate>
    );
    return handle;
}

/** Alias for {@link watchDebounceIfValid}. */
export const watchDebouncedValid = watchDebounceIfValid;
/** Alias for {@link watchDebounceIfValid}. */
export const watchDebouncedIsValid = watchDebounceIfValid;
/** Alias for {@link watchDebounceIfValid}. */
export const watchDebounceValid = watchDebounceIfValid;
/** Alias for {@link watchDebounceIfValid}. */
export const watchComputedDebounceValid = watchDebounceIfValid;
/** Alias for {@link watchDebounceIfValid}. */
export const watchComputedDebounceIsValid = watchDebounceIfValid;