/**
 * Cria uma função que invoca `func` com os argumentos invertidos.
 * Semelhante ao _.flip do Lodash.
 *
 * @param func função a envolver
 * @returns nova função com argumentos invertidos
 */
export function flip<T extends (...args: any[]) => any>(func: T): (...args: any[]) => ReturnType<T> {
    if (typeof func !== 'function') throw new TypeError('Expected a function');

    return function (this: unknown, ...args: any[]): ReturnType<T> {
        return func.apply(this, args.reverse());
    };
}
