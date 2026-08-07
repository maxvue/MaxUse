import { toInteger } from '../Lang/toInteger';

/**
 * Cria uma função que agrupa os argumentos a partir do índice `start` num
 * array e o repassa como último parâmetro para `func`.
 * Semelhante ao _.rest do Lodash.
 *
 * @param func função a envolver
 * @param start índice a partir do qual os argumentos são agrupados (padrão: `func.length - 1`)
 * @returns nova função com os últimos argumentos agrupados em array
 */
export function rest<T extends (...args: any[]) => any>(func: T, start?: number): (...args: any[]) => ReturnType<T> {
    if (typeof func !== 'function') throw new TypeError('Expected a function');

    const from = Math.max(start === undefined ? func.length - 1 : toInteger(start), 0);

    return function (this: unknown, ...args: any[]): ReturnType<T> {
        const head: unknown[] = args.slice(0, from);
        while (head.length < from) head.push(undefined);
        const tail = args.slice(from);
        return func.apply(this, [...head, tail]);
    };
}
