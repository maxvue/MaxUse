import { toValue, type MaybeRefOrGetter } from 'vue';

/**
 * Remove todas as ocorrências dos `values` especificados do array,
 * usando SameValueZero para comparação (com suporte a `NaN`). **Muta** o
 * array de entrada.
 * Semelhante ao _.pull do Lodash.
 *
 * @param array array a modificar (mutado in-place)
 * @param values valores a remover
 * @returns o próprio array, sem os valores removidos
 */
export function pull<T>(array: MaybeRefOrGetter<T[] | null | undefined>, ...values: T[]): T[] | null | undefined {
    const data = toValue(array);
    if (!data || !data.length || !values.length) return data;

    const sameValueZero = (a: T, b: T) => a === b || (a !== a && b !== b);

    for (let index = data.length - 1; index >= 0; index--) if (values.some((value) => sameValueZero(data[index], value))) data.splice(index, 1);


    return data;
}
