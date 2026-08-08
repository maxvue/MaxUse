import { toValue, type MaybeRefOrGetter } from 'vue';
import { iteratee } from '../Utils/iteratee';

/**
 * Retorna os elementos do final de `array` enquanto `predicate` (via
 * `iteratee`) retornar valor verdadeiro.
 * Semelhante ao _.takeRightWhile do Lodash.
 *
 * @param array array de entrada
 * @param predicate condição a testar em cada elemento a partir do final
 * @returns novo array com o sufixo que casou
 */
export function takeRightWhile<T>(array: MaybeRefOrGetter<T[] | null | undefined>, predicate?: unknown): T[] {
    const data = toValue(array);
    if (!data || !data.length) return [];

    const fn = iteratee(predicate) as (value: T, index: number, collection: unknown) => unknown;
    let start = data.length;
    while (start > 0 && fn(data[start - 1], start - 1, data)) start--;

    return data.slice(start);
}
