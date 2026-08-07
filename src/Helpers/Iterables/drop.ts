import { toValue, type MaybeRefOrGetter } from 'vue';
import { toInteger } from '../Lang/toInteger';

/**
 * Retorna o array sem os `n` primeiros elementos.
 * Semelhante ao _.drop do Lodash.
 *
 * @param array array de entrada
 * @param n quantidade de elementos a remover do início (padrão `1`)
 * @returns novo array sem os `n` primeiros elementos
 */
export function drop<T>(array: MaybeRefOrGetter<T[] | null | undefined>, n?: number): T[] {
    const data = toValue(array);
    const length = data == null ? 0 : data.length;
    if (!length) return [];

    const count = n === undefined ? 1 : toInteger(n);
    return data!.slice(count < 0 ? 0 : count, length);
}
