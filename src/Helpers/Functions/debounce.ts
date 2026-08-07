import { toNumber } from '../Strings/converters';

export interface DebounceOptions {
    leading?: boolean;
    trailing?: boolean;
    maxWait?: number;
}

export interface DebouncedFunction<T extends (...args: any[]) => any> {
    (...args: Parameters<T>): ReturnType<T> | undefined;
    cancel: () => void;
    flush: () => ReturnType<T> | undefined;
    pending: () => boolean;
}

/**
 * Cria uma versão "debounced" de `func` que atrasa a invocação até `wait`
 * milissegundos terem se passado desde a última vez que a função debounced
 * foi chamada. Suporta `options.leading`, `options.trailing` e
 * `options.maxWait`, além dos métodos `.cancel()`, `.flush()` e `.pending()`.
 * Semelhante ao _.debounce do Lodash.
 *
 * @param func função a debounçar
 * @param wait milissegundos de espera (padrão 0)
 * @param options `leading`, `trailing` e `maxWait`
 * @returns função debounced com `.cancel()`, `.flush()` e `.pending()`
 */
export function debounce<T extends (...args: any[]) => any>(func: T, wait: number = 0, options?: DebounceOptions): DebouncedFunction<T> {
    if (typeof func !== 'function') throw new TypeError('Expected a function');

    let lastArgs: Parameters<T> | undefined;
    let lastThis: unknown;
    let maxWait: number | undefined;
    let result: ReturnType<T> | undefined;
    let timerId: ReturnType<typeof setTimeout> | undefined;
    let lastCallTime: number | undefined;
    let lastInvokeTime = 0;
    let leading = false;
    let maxing = false;
    let trailing = true;

    const waitTime = toNumber(wait) || 0;
    if (options && typeof options === 'object') {
        leading = !!options.leading;
        maxing = 'maxWait' in options;
        maxWait = maxing ? Math.max(toNumber(options.maxWait) || 0, waitTime) : undefined;
        trailing = 'trailing' in options ? !!options.trailing : trailing;
    }

    function invokeFunc(time: number): ReturnType<T> | undefined {
        const args = lastArgs;
        const thisArg = lastThis;
        lastArgs = lastThis = undefined;
        lastInvokeTime = time;
        result = func.apply(thisArg, args as Parameters<T>);
        return result;
    }

    function leadingEdge(time: number): ReturnType<T> | undefined {
        lastInvokeTime = time;
        timerId = setTimeout(timerExpired, waitTime);
        return leading ? invokeFunc(time) : result;
    }

    function remainingWait(time: number): number {
        const timeSinceLastCall = time - (lastCallTime as number);
        const timeSinceLastInvoke = time - lastInvokeTime;
        const timeWaiting = waitTime - timeSinceLastCall;
        return maxing ? Math.min(timeWaiting, (maxWait as number) - timeSinceLastInvoke) : timeWaiting;
    }

    function shouldInvoke(time: number): boolean {
        const timeSinceLastCall = time - (lastCallTime ?? 0);
        const timeSinceLastInvoke = time - lastInvokeTime;
        return (lastCallTime === undefined) || (timeSinceLastCall >= waitTime) || (timeSinceLastCall < 0) || (maxing && timeSinceLastInvoke >= (maxWait as number));
    }

    function timerExpired(): void {
        const time = Date.now();
        if (shouldInvoke(time)) {
            trailingEdge(time);
            return;
        }
        timerId = setTimeout(timerExpired, remainingWait(time));
    }

    function trailingEdge(time: number): ReturnType<T> | undefined {
        timerId = undefined;
        if (trailing && lastArgs) return invokeFunc(time);
        lastArgs = lastThis = undefined;
        return result;
    }

    function cancel(): void {
        if (timerId !== undefined) clearTimeout(timerId);
        lastInvokeTime = 0;
        lastArgs = lastCallTime = lastThis = timerId = undefined;
    }

    function flush(): ReturnType<T> | undefined {
        return timerId === undefined ? result : trailingEdge(Date.now());
    }

    function pending(): boolean {
        return timerId !== undefined;
    }

    function debounced(this: unknown, ...args: Parameters<T>): ReturnType<T> | undefined {
        const time = Date.now();
        const isInvoking = shouldInvoke(time);

        lastArgs = args;
        lastThis = this;
        lastCallTime = time;

        if (isInvoking) {
            if (timerId === undefined) return leadingEdge(lastCallTime);
            if (maxing) {
                clearTimeout(timerId);
                timerId = setTimeout(timerExpired, waitTime);
                return invokeFunc(lastCallTime);
            }
        }
        if (timerId === undefined) timerId = setTimeout(timerExpired, waitTime);
        return result;
    }

    debounced.cancel = cancel;
    debounced.flush = flush;
    debounced.pending = pending;
    return debounced;
}
