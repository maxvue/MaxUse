import { toValue, type MaybeRefOrGetter } from 'vue';
import { iteratee } from '../Utils/iteratee';

/**
 * Como `sortedUniq`, mas aceita `iterateeFn` (via `iteratee`) para derivar
 * o critério de comparação entre elementos consecutivos. Assume `array`
 * já ordenado por esse critério.
 * Semelhante ao _.sortedUniqBy do Lodash.
 *
 * @param array array ordenado
 * @param iterateeFn função (ou shorthand) que deriva o critério de comparação
 * @returns novo array sem duplicatas consecutivas por critério
 */
export function sortedUniqBy<T>(array: MaybeRefOrGetter<T[] | null | undefined>, iterateeFn?: unknown): T[] {
    const data = toValue(array);
    if (!data || !data.length) return [];

    const fn = iteratee(iterateeFn) as (value: T) => unknown;
    const result: T[] = [data[0]];
    let prevKey = fn(data[0]);

    for (let index = 1; index < data.length; index++) {
        const item = data[index];
        const key = fn(item);
        if (!(prevKey === key || (prevKey !== prevKey && key !== key))) {
            result.push(item);
            prevKey = key;
        }
    }

    return result;
}
