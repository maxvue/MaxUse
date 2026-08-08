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

    for (const item of flat) {
        const already = result.some((r) => r === item || (r !== r && item !== item));
        if (!already) result.push(item);
    }

    return result;
}
