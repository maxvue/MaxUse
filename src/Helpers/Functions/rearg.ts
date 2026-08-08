/**
 * Cria uma função que invoca `func` com os argumentos reordenados
 * conforme `indexes`: o argumento na posição `indexes[i]` da chamada
 * original passa a ocupar a posição `i`. Posições sem índice
 * correspondente mantêm o argumento original na mesma posição; índices
 * fora do alcance viram `undefined`.
 * Semelhante ao _.rearg do Lodash.
 *
 * @param func função a invocar com os argumentos reordenados
 * @param indexes nova ordem dos argumentos
 * @returns nova função com os argumentos reordenados
 */
export function rearg<T extends (...args: any[]) => any>(func: T, ...indexes: number[] | [number[]]): (...args: any[]) => ReturnType<T> {
    if (typeof func !== 'function') throw new TypeError('Expected a function');

    const order = indexes.length === 1 && Array.isArray(indexes[0]) ? indexes[0] : (indexes as number[]);

    return function (this: unknown, ...args: any[]): ReturnType<T> {
        const reordered = args.slice();
        for (let i = 0; i < order.length; i++) reordered[i] = args[order[i]];

        return func.apply(this, reordered);
    };
}
