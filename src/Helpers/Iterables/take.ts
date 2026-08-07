import { toValue, type MaybeRefOrGetter } from 'vue';
import { toInteger } from '../Lang/toInteger';

/**
 * Retorna os `n` primeiros elementos do array.
 * Semelhante ao _.take do Lodash.
 *
 * @param array array de entrada
 * @param n quantidade de elementos a retornar do início (padrão `1`)
 * @returns novo array com os `n` primeiros elementos
 */
export function take<T>(array: MaybeRefOrGetter<T[] | null | undefined>, n?: number): T[] {
    const data = toValue(array);
    if (!data || !data.length) return [];

    const count = n === undefined ? 1 : toInteger(n);
    return data.slice(0, count < 0 ? 0 : count);
}
