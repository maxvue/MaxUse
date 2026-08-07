import { toValue, type MaybeRefOrGetter } from 'vue';

/**
 * Achata o array em 1 nível de profundidade.
 * Semelhante ao _.flatten do Lodash.
 *
 * @param array array (possivelmente aninhado) a achatar
 * @returns novo array achatado em 1 nível
 */
export function flatten<T>(array: MaybeRefOrGetter<Array<T | T[]> | null | undefined>): T[] {
    const data = toValue(array);
    if (!data || !data.length) return [];
    return (data as Array<T | T[]>).flat(1) as T[];
}
