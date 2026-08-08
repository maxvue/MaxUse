import { toValue, type MaybeRefOrGetter } from 'vue';
import { toInteger } from '../Lang/toInteger';

/**
 * Retorna os `n` últimos elementos do array.
 * Semelhante ao _.takeRight do Lodash.
 *
 * @param array array de entrada
 * @param n quantidade de elementos a retornar do fim (padrão `1`)
 * @returns novo array com os `n` últimos elementos
 */
export function takeRight<T>(array: MaybeRefOrGetter<T[] | null | undefined>, n?: number): T[] {
    const data = toValue(array);
    const length = data == null ? 0 : data.length;
    if (!length) return [];

    const count = n === undefined ? 1 : toInteger(n);
    const start = length - count;
    return data!.slice(start < 0 ? 0 : start, length);
}
