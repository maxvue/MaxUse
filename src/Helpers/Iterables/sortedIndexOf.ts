import { toValue, type MaybeRefOrGetter } from 'vue';
import { sortedIndex } from './sortedIndex';

/**
 * Retorna o índice da primeira ocorrência de `value` em `array`
 * (previamente ordenado), usando busca binária.
 * Semelhante ao _.sortedIndexOf do Lodash.
 *
 * @param array array ordenado
 * @param value valor a procurar
 * @returns índice encontrado, ou `-1`
 */
export function sortedIndexOf<T>(array: MaybeRefOrGetter<T[] | null | undefined>, value: T): number {
    const data = toValue(array);
    const length = data == null ? 0 : data.length;
    if (!length) return -1;

    const index = sortedIndex(data, value);
    return index < length && data![index] === value ? index : -1;
}
