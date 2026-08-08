import { debounce } from './debounce';

export interface ThrottleOptions {
    leading?: boolean;
    trailing?: boolean;
}

/**
 * Cria uma versão "throttled" de `func`, que invoca `func` no máximo uma
 * vez a cada `wait` milissegundos. Implementado sobre `debounce`, usando
 * `maxWait: wait`. Suporta `options.leading` e `options.trailing`, além dos
 * métodos `.cancel()`, `.flush()` e `.pending()`.
 * Semelhante ao _.throttle do Lodash.
 *
 * @param func função a limitar
 * @param wait milissegundos mínimos entre invocações (padrão 0)
 * @param options `leading` (padrão `true`) e `trailing` (padrão `true`)
 * @returns função throttled com `.cancel()`, `.flush()` e `.pending()`
 */
export function throttle<T extends (...args: any[]) => any>(func: T, wait: number = 0, options?: ThrottleOptions) {
    let leading = true;
    let trailing = true;

    if (typeof func !== 'function') throw new TypeError('Expected a function');

    if (options && typeof options === 'object') {
        leading = 'leading' in options ? !!options.leading : leading;
        trailing = 'trailing' in options ? !!options.trailing : trailing;
    }

    return debounce(func, wait, { leading, trailing, maxWait: wait });
}
