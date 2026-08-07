import { toValue, type MaybeRefOrGetter } from 'vue';
import { iteratee } from '../Utils/iteratee';

/**
 * Remove elementos do início de `array` enquanto `predicate` (via
 * `iteratee` — aceita função, string, array `[path, srcValue]` ou objeto)
 * retornar valor verdadeiro, e retorna o restante.
 * Semelhante ao _.dropWhile do Lodash.
 *
 * @param array array de entrada
 * @param predicate condição a testar em cada elemento a partir do início
 * @returns novo array sem o prefixo que casou
 */
export function dropWhile<T>(array: MaybeRefOrGetter<T[] | null | undefined>, predicate?: unknown): T[] {
    const data = toValue(array);
    if (!data || !data.length) return [];

    const fn = iteratee(predicate) as (value: T, index: number, collection: unknown) => unknown;
    let index = 0;
    while (index < data.length && fn(data[index], index, data)) index++;

    return data.slice(index);
}
