import { debounce, type DebouncedFunction } from './debounce';

export interface ThrottleOptions {
    leading?: boolean;
    trailing?: boolean;
}

/**
 * Creates a throttled function that only invokes `func` at most once per every
 * `wait` milliseconds. Implemented over `debounce` using `maxWait: wait`.
 * Supports `options.leading` and `options.trailing`, plus the `.cancel()`,
 * `.flush()`, and `.pending()` control methods.
 * Equivalent to Lodash `_.throttle`.
 *
 * @template T - The target function type.
 * @param func - The function to throttle.
 * @param wait - The number of milliseconds to throttle invocations to (default: 0).
 * @param options - Options object with `leading` (default: true) and `trailing` (default: true).
 * @returns A new throttled function with `.cancel()`, `.flush()`, and `.pending()` methods.
 */
export function throttle<T extends (...args: any[]) => any>(
    func: T,
    wait: number = 0,
    options?: ThrottleOptions
): DebouncedFunction<T> {
    let leading = true;
    let trailing = true;

    if (typeof func !== 'function') throw new TypeError('Expected a function');

    if (options && typeof options === 'object') {
        leading = 'leading' in options ? !!options.leading : leading;
        trailing = 'trailing' in options ? !!options.trailing : trailing;
    }

    return debounce(func, wait, { leading, trailing, maxWait: wait });
}
