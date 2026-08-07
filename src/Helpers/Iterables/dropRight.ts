import { toValue, type MaybeRefOrGetter } from 'vue';
import { toInteger } from '../Lang/toInteger';

/**
 * Retorna o array sem os `n` últimos elementos.
 * Semelhante ao _.dropRight do Lodash.
 *
 * @param array array de entrada
 * @param n quantidade de elementos a remover do fim (padrão `1`)
 * @returns novo array sem os `n` últimos elementos
 */
export function dropRight<T>(array: MaybeRefOrGetter<T[] | null | undefined>, n?: number): T[] {
    const data = toValue(array);
    const length = data == null ? 0 : data.length;
    if (!length) return [];

    const count = n === undefined ? 1 : toInteger(n);
    const end = length - count;
    return data!.slice(0, end < 0 ? 0 : end);
}
