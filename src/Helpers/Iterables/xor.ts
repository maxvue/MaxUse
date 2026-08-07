/**
 * Cria um array com os valores que estão presentes em **exatamente um**
 * dos arrays fornecidos (diferença simétrica), sem duplicatas, usando
 * SameValueZero para comparação (com suporte a `NaN`).
 * Semelhante ao _.xor do Lodash.
 *
 * @param arrays arrays a comparar
 * @returns novo array com a diferença simétrica
 */
export function xor<T>(...arrays: T[][]): T[] {
    const valid = arrays.filter((a) => Array.isArray(a));
    const result: T[] = [];

    const sameValueZero = (a: T, b: T) => a === b || (a !== a && b !== b);

    for (const current of valid) for (const item of current) {
        const occurrences = valid.filter((arr) => arr.some((value) => sameValueZero(value, item))).length;
        const alreadyAdded = result.some((r) => sameValueZero(r, item));
        if (occurrences === 1 && !alreadyAdded) result.push(item);
    }


    return result;
}
