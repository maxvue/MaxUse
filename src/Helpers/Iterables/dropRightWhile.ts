import { toValue, type MaybeRefOrGetter } from 'vue';
import { iteratee } from '../Utils/iteratee';

/**
 * Remove elementos do final de `array` enquanto `predicate` (via
 * `iteratee`) retornar valor verdadeiro, e retorna o restante.
 * Semelhante ao _.dropRightWhile do Lodash.
 *
 * @param array array de entrada
 * @param predicate condição a testar em cada elemento a partir do final
 * @returns novo array sem o sufixo que casou
 */
export function dropRightWhile<T>(array: MaybeRefOrGetter<T[] | null | undefined>, predicate?: unknown): T[] {
    const data = toValue(array);
    if (!data || !data.length) return [];

    const fn = iteratee(predicate) as (value: T, index: number, collection: unknown) => unknown;
    let end = data.length;
    while (end > 0 && fn(data[end - 1], end - 1, data)) end--;

    return data.slice(0, end);
}
