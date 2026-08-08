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
    const result: T[] = [];

    for (const item of first) {
        const already = result.some((r) => r === item || (r !== r && item !== item));
        if (already) continue;

        const inAll = rest.every((arr) => arr.some((value) => value === item || (value !== value && item !== item)));
        if (inAll) result.push(item);
    }

    return result;
}
