/**
 * Cria um array com os valores presentes em **todos** os arrays
 * fornecidos, usando SameValueZero para comparação (com suporte a `NaN`).
 * O resultado não tem duplicatas.
 * Semelhante ao _.intersection do Lodash.
 *
 * @param arrays arrays a interseccionar
 * @returns novo array com a interseção
 */
export function intersection<T>(...arrays: T[][]): T[] {
    if (!arrays.length) return [];

    const casted = arrays.map((a) => (Array.isArray(a) ? a : []));
    const [first, ...rest] = casted;
    const restSets = rest.map((arr) => new Set(arr));
    const result: T[] = [];
    const seen = new Set<T>();

    for (const item of first) {
        if (seen.has(item)) continue;

        const inAll = restSets.every((set) => set.has(item));
        if (inAll) {
            seen.add(item);
            result.push(item);
        }
    }

    return result;
}
