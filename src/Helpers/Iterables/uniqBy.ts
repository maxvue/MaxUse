import { toValue, type MaybeRefOrGetter } from 'vue';
import { iteratee } from '../Utils/iteratee';

/**
 * Como `uniq`, mas aceita `iterateeFn` (via `iteratee` — aceita função,
 * string, array `[path, srcValue]` ou objeto) para derivar o critério de
 * unicidade de cada elemento. Mantém a primeira ocorrência de cada
 * critério.
 * Semelhante ao _.uniqBy do Lodash.
 *
 * @param array array a processar
 * @param iterateeFn função (ou shorthand) que deriva o critério de unicidade
 * @returns novo array com valores únicos por critério
 */
export function uniqBy<T>(array: MaybeRefOrGetter<T[] | null | undefined>, iterateeFn?: unknown): T[] {
    const data = toValue(array);
    if (!data || !data.length) return [];

    const fn = iteratee(iterateeFn) as (value: T) => unknown;
    const seen = new Set<unknown>();
    const result: T[] = [];

    for (const item of data) {
        const key = fn(item);
        if (!seen.has(key)) {
            seen.add(key);
            result.push(item);
        }
    }
    return result;
}
