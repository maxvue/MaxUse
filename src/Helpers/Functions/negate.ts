/**
 * Cria uma função que nega o resultado do predicado informado.
 * Semelhante ao _.negate do Lodash.
 *
 * @param predicate O predicado a ser negado.
 * @returns A nova função negada.
 */
export function negate<T extends (...args: any[]) => any>(predicate: T): (...args: Parameters<T>) => boolean {
    if (typeof predicate !== 'function') throw new TypeError('Expected a function');

    return function (this: unknown, ...args: Parameters<T>): boolean {
        return !predicate.apply(this, args);
    };
}
