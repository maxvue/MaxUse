import { toValue, type MaybeRefOrGetter } from 'vue';
import { toInteger } from '../Lang/toInteger';

/**
 * Achata o array até a profundidade `depth` especificada.
 * Semelhante ao _.flattenDepth do Lodash.
 *
 * @param array array (possivelmente aninhado) a achatar
 * @param depth profundidade máxima de achatamento (padrão `1`)
 * @returns novo array achatado até `depth` níveis
 */
export function flattenDepth<T>(array: MaybeRefOrGetter<unknown[] | null | undefined>, depth?: number): T[] {
    const data = toValue(array);
    if (!data || !data.length) return [];

    const d = depth === undefined ? 1 : toInteger(depth);
    return data.flat(d) as T[];
}
