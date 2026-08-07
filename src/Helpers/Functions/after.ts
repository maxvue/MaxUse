import { toInteger } from '../Lang/toInteger';

/**
 * Cria uma função que só invoca `func` a partir da n-ésima vez que for
 * chamada (inclusive). Chamadas anteriores à n-ésima não invocam `func` e
 * retornam `undefined`.
 * Semelhante ao _.after do Lodash.
 *
 * @param n número de chamadas antes de `func` ser invocada
 * @param func função a invocar
 * @returns nova função restrita
 */
export function after<T extends (...args: any[]) => any>(n: number, func: T): (...args: Parameters<T>) => ReturnType<T> | undefined {
    if (typeof func !== 'function') throw new TypeError('Expected a function');

    let count = toInteger(n);
    return function (this: unknown, ...args: Parameters<T>): ReturnType<T> | undefined {
        if (--count < 1) return func.apply(this, args);
        return undefined;
    };
}
