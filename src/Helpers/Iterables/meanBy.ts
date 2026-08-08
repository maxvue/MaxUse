import { toValue, type MaybeRefOrGetter } from 'vue';
import { iteratee } from '../Utils/iteratee';

/**
 * Como `mean`, mas aceita `iterateeFn` (via `iteratee` — aceita função,
 * string, array `[path, srcValue]` ou objeto) para derivar o valor a
 * ser somado/dividido a partir de cada elemento. Retorna `NaN` se `array`
 * for vazio, `null` ou `undefined`.
 * Semelhante ao _.meanBy do Lodash.
 *
 * @param array array a percorrer
 * @param iterateeFn função (ou shorthand) que deriva o valor numérico
 * @returns a média, ou `NaN`
 */
export function meanBy<T>(array: MaybeRefOrGetter<T[] | null | undefined>, iterateeFn?: unknown): number {
    const data = toValue(array);
    const length = data == null ? 0 : data.length;
    if (!length) return NaN;

    const fn = iteratee(iterateeFn) as (value: T) => number;
    let sum = 0;
    for (const value of data as T[]) sum += fn(value);
    return sum / length;
}
