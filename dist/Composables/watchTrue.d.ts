import { WatchDebouncedOptions, whenever, WheneverOptions } from '@vueuse/core';
import { WatchSource, WatchHandle } from 'vue';
export declare const watchTrue: typeof whenever;
export declare function watchIfValid<T, Immediate extends Readonly<boolean> = false>(source: WatchSource<T>, callback: (value: NonNullable<T>, oldValue: T | undefined) => void, options?: WheneverOptions<Immediate>): WatchHandle;
export declare const watchValid: typeof watchIfValid;
export declare const watchIsValid: typeof watchIfValid;
export declare const watchIsValidComputed: typeof watchIfValid;
export declare const watchComputedIsValid: typeof watchIfValid;
export declare function watchDebounceIfValid<T, Immediate extends Readonly<boolean> = false>(source: WatchSource<T>, callback: (value: NonNullable<T>, oldValue: T | undefined) => void, options?: WatchDebouncedOptions<Immediate>): WatchHandle;
export declare const watchDebouncedValid: typeof watchDebounceIfValid;
export declare const watchDebouncedIsValid: typeof watchDebounceIfValid;
export declare const watchDebounceValid: typeof watchDebounceIfValid;
export declare const watchComputedDebounceValid: typeof watchDebounceIfValid;
export declare const watchComputedDebounceIsValid: typeof watchDebounceIfValid;
//# sourceMappingURL=watchTrue.d.ts.map