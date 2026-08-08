import { toInteger } from '../Lang/toInteger';

/**
 * Cria uma função que invoca `func`, aceitando no máximo `n` argumentos —
 * os argumentos excedentes são descartados antes da chamada.
 * Semelhante ao _.ary do Lodash.
 *
 * @param func função a envolver
 * @param n número máximo de argumentos aceitos (padrão: `func.length`)
 * @returns nova função com aridade limitada
 */
export function ary<T extends (...args: any[]) => any>(func: T, n: number = func.length): (...args: any[]) => ReturnType<T> {
    if (typeof func !== 'function') throw new TypeError('Expected a function');

    const max = Math.max(toInteger(n), 0);
    return function (this: unknown, ...args: any[]): ReturnType<T> {
        return func.apply(this, args.slice(0, max));
    };
}
