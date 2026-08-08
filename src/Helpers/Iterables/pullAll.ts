import { toValue, type MaybeRefOrGetter } from 'vue';
import { pull } from './pull';

/**
 * Remove todas as ocorrências dos valores presentes em `values` do array,
 * usando SameValueZero para comparação. **Muta** o array de entrada.
 * Diferente do `pull`, recebe os valores como um único array, não como
 * argumentos variádicos.
 * Semelhante ao _.pullAll do Lodash.
 *
 * @param array array a modificar (mutado in-place)
 * @param values array de valores a remover
 * @returns o próprio array, sem os valores removidos
 */
export function pullAll<T>(
    array: MaybeRefOrGetter<T[] | null | undefined>,
    values: MaybeRefOrGetter<T[] | null | undefined>
): T[] | null | undefined {
    const data = toValue(array);
    const vals = toValue(values);
    if (!data || !data.length || !vals || !vals.length) return data;

    return pull(data, ...vals);
}
