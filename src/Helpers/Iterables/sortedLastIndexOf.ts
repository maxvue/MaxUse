import { toValue, type MaybeRefOrGetter } from 'vue';
import { sortedLastIndex } from './sortedLastIndex';

/**
 * Retorna o índice da última ocorrência de `value` em `array`
 * (previamente ordenado), usando busca binária.
 * Semelhante ao _.sortedLastIndexOf do Lodash.
 *
 * @param array array ordenado
 * @param value valor a procurar
 * @returns índice encontrado, ou `-1`
 */
export function sortedLastIndexOf<T>(array: MaybeRefOrGetter<T[] | null | undefined>, value: T): number {
    const data = toValue(array);
    const length = data == null ? 0 : data.length;
    if (!length) return -1;

    const index = sortedLastIndex(data, value) - 1;
    return index >= 0 && data![index] === value ? index : -1;
}
