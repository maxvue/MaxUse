import { toValue, type MaybeRefOrGetter } from 'vue';
import { iteratee } from '../Utils/iteratee';
import { baseSortedIndexBy } from './_baseSortedIndexBy';

/**
 * Como `sortedIndex`, mas aceita `iterateeFn` (via `iteratee`) para
 * derivar o critério de ordenação a partir de cada elemento e de `value`.
 * Valores não totalmente ordenáveis (`NaN`, `null`, `undefined`,
 * `Symbol`) recebem tratamento especial em vez de serem sempre
 * posicionados no índice `0`.
 * Semelhante ao _.sortedIndexBy do Lodash.
 *
 * @param array array ordenado (pelo critério de `iterateeFn`)
 * @param value valor a posicionar
 * @param iterateeFn função (ou shorthand) que deriva o critério comparável
 * @returns menor índice de inserção que mantém a ordenação
 */
export function sortedIndexBy<T>(array: MaybeRefOrGetter<T[] | null | undefined>, value: T, iterateeFn?: unknown): number {
    const data = toValue(array);
    const fn = iteratee(iterateeFn) as (v: T) => unknown;
    return baseSortedIndexBy(data, value, fn, false);
}
