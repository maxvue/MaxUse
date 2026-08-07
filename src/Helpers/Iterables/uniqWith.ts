import { toValue, type MaybeRefOrGetter } from 'vue';

/**
 * Como `uniq`, mas usa `comparator` para determinar a igualdade entre
 * elementos, em vez de SameValueZero. Comparação O(n²): cada elemento é
 * testado contra todos os já aceitos. Mantém a primeira ocorrência.
 * Semelhante ao _.uniqWith do Lodash.
 *
 * @param array array a processar
 * @param comparator função `(a, b) => boolean` que decide se dois valores são iguais
 * @returns novo array com valores únicos segundo `comparator`
 */
export function uniqWith<T>(array: MaybeRefOrGetter<T[] | null | undefined>, comparator: (a: T, b: T) => boolean): T[] {
    const data = toValue(array);
    if (!data || !data.length) return [];

    const result: T[] = [];
    for (const item of data) if (!result.some((existing) => comparator(item, existing))) result.push(item);

    return result;
}
