import { toValue, type MaybeRefOrGetter } from 'vue';
import { iteratee } from '../Utils/iteratee';
import { baseExtremum } from './_baseExtremum';

/**
 * Como `max`, mas aceita `iterateeFn` (via `iteratee` — aceita função,
 * string, array `[path, srcValue]` ou objeto) para derivar o critério de
 * comparação a partir de cada elemento.
 * Semelhante ao _.maxBy do Lodash.
 *
 * @param array array a inspecionar
 * @param iterateeFn função (ou shorthand) que deriva o valor comparável
 * @returns o elemento com o maior valor derivado, ou `undefined`
 */
export function maxBy<T>(array: MaybeRefOrGetter<T[] | null | undefined>, iterateeFn?: unknown): T | undefined {
    const data = toValue(array);
    if (!data || !data.length) return undefined;
    const fn = iteratee(iterateeFn) as (value: T) => unknown;
    return baseExtremum(data, fn, (a, b) => (a as number) > (b as number));
}
