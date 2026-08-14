/**
 * Cria um array com a união de todos os arrays fornecidos, sem duplicatas,
 * usando SameValueZero para comparação (com suporte a `NaN`).
 * Semelhante ao _.union do Lodash.
 *
 * @param arrays arrays a unir
 * @returns novo array com a união, sem duplicatas
 */
export function union<T>(...arrays: T[][]): T[] {
    const flat = arrays.filter((a) => Array.isArray(a)).flat(1) as T[];
    const result: T[] = [];
    const seen = new Set<T>();

    for (const item of flat) {
        if (seen.has(item)) continue;
        seen.add(item);
        result.push(item);
    }

    return result;
}
