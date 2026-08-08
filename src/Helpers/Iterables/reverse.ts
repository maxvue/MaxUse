import { toValue, type MaybeRefOrGetter } from 'vue';

/**
 * Inverte a ordem dos elementos do array. **Muta** o array de entrada,
 * assim como `Array#reverse` nativo.
 * Semelhante ao _.reverse do Lodash.
 *
 * @param array array a inverter (mutado in-place)
 * @returns o próprio array, invertido
 */
export function reverse<T>(array: MaybeRefOrGetter<T[] | null | undefined>): T[] | null | undefined {
    const data = toValue(array);
    if (data == null) return data;
    return data.reverse();
}
