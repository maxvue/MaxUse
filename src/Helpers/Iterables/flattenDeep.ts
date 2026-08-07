import { toValue, type MaybeRefOrGetter } from 'vue';

/**
 * Achata o array recursivamente, em qualquer profundidade de aninhamento.
 * Semelhante ao _.flattenDeep do Lodash.
 *
 * @param array array (possivelmente aninhado) a achatar
 * @returns novo array totalmente achatado
 */
export function flattenDeep<T>(array: MaybeRefOrGetter<unknown[] | null | undefined>): T[] {
    const data = toValue(array);
    if (!data || !data.length) return [];
    return data.flat(Infinity) as T[];
}
