import { watchDebounced, type WatchDebouncedOptions, whenever, type WheneverOptions } from '@vueuse/core';
import { watch, nextTick, type WatchSource, type WatchOptions, type WatchHandle } from 'vue';
import { isNotEmpty } from '../Helpers/Validations';

export const watchTrue = whenever;

export function watchIfValid<T, Immediate extends Readonly<boolean> = false>( source: WatchSource<T>, callback: (value: NonNullable<T>, oldValue: T | undefined) => void, options?: WheneverOptions<Immediate> ): WatchHandle {
    const handle = watch( source, (value, oldValue) => {
        if (isNotEmpty(value)) return;

        if (options?.once) nextTick(() => handle.stop());

        callback(value as NonNullable<T>, oldValue);
    }, { ...options, once: false } as WatchOptions );

    return handle;
}

export const watchValid = watchIfValid;
export const watchIsValid = watchIfValid;
export const watchIsValidComputed = watchIfValid;
export const watchComputedIsValid = watchIfValid;

export function watchDebounceIfValid<T, Immediate extends Readonly<boolean> = false>( source: WatchSource<T>, callback: (value: NonNullable<T>, oldValue: T | undefined) => void, options?: WatchDebouncedOptions<Immediate> ): WatchHandle {
    const handle = watchDebounced( source, (value, oldValue) => {
        if (isNotEmpty(value)) return;

        if (options?.once) nextTick(() => handle.stop());

        callback(value as NonNullable<T>, oldValue);
    }, { ...options, once: false } as WatchDebouncedOptions<Immediate>);
    return handle;
}

export const watchDebouncedValid = watchDebounceIfValid;
export const watchDebouncedIsValid = watchDebounceIfValid;
export const watchDebounceValid = watchDebounceIfValid;
export const watchComputedDebounceValid = watchDebounceIfValid;
export const watchComputedDebounceIsValid = watchDebounceIfValid;