import { toValue, type MaybeRefOrGetter } from 'vue';

/**
 * Remove duplicatas **consecutivas** de um array previamente ordenado,
 * usando SameValueZero para comparação (com suporte a `NaN`).
 * Semelhante ao _.sortedUniq do Lodash.
 *
 * @param array array ordenado
 * @returns novo array sem duplicatas consecutivas
 */
export function sortedUniq<T>(array: MaybeRefOrGetter<T[] | null | undefined>): T[] {
    const data = toValue(array);
    if (!data || !data.length) return [];

    const result: T[] = [data[0]];
    for (let index = 1; index < data.length; index++) {
        const prev = data[index - 1];
        const item = data[index];
        if (!(prev === item || (prev !== prev && item !== item))) result.push(item);
    }

    return result;
}
