import { toValue, type MaybeRefOrGetter } from 'vue';

/**
 * Como `pullAll`, mas aceita `comparator` para determinar a igualdade
 * entre elementos, em vez de SameValueZero. **Muta** o array de entrada.
 * Semelhante ao _.pullAllWith do Lodash.
 *
 * @param array array a modificar (mutado in-place)
 * @param values array de valores a remover
 * @param comparator função `(a, b) => boolean` que decide se dois valores são iguais
 * @returns o próprio array, sem os valores removidos
 */
export function pullAllWith<T>(
    array: MaybeRefOrGetter<T[] | null | undefined>,
    values: MaybeRefOrGetter<T[] | null | undefined>,
    comparator: (a: T, b: T) => boolean
): T[] | null | undefined {
    const data = toValue(array);
    const vals = toValue(values);
    if (!data || !data.length || !vals || !vals.length) return data;

    let index = 0;
    while (index < data.length) if (vals.some((value) => comparator(data[index], value))) data.splice(index, 1);
    else index++;


    return data;
}
