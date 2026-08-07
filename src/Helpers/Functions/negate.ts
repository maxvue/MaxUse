/**
 * Cria uma função que nega o resultado da função `predicate`.
 * O argumento `predicate` é invocado com os argumentos recebidos pela função criada.
 * Semelhante ao _.negate do Lodash.
 *
 * @param predicate a função a negar
 * @returns a nova função negada
 */
export function negate<T extends (...args: any[]) => any>(predicate: T): (...args: Parameters<T>) => boolean {
    if (typeof predicate !== 'function') throw new TypeError('Expected a function');

    return function (this: unknown, ...args: Parameters<T>): boolean {
        return !predicate.apply(this, args);
    };
}
