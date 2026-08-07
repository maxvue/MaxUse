import { toValue, type MaybeRefOrGetter } from 'vue';

/**
 * Usa busca binária para encontrar o maior índice em que `value` deveria
 * ser inserido em `array` (previamente ordenado) para manter a ordenação,
 * posicionando-o após qualquer ocorrência existente igual a `value`.
 * Semelhante ao _.sortedLastIndex do Lodash.
 *
 * @param array array ordenado
 * @param value valor a posicionar
 * @returns índice de inserção
 */
export function sortedLastIndex<T>(array: MaybeRefOrGetter<T[] | null | undefined>, value: T): number {
    const data = toValue(array) || [];
    let low = 0;
    let high = data.length;

    while (low < high) {
        const mid = (low + high) >>> 1;
        if (data[mid] <= value) low = mid + 1;
        else high = mid;
    }

    return low;
}
