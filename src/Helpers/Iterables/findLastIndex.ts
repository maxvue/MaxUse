import { toValue, type MaybeRefOrGetter } from 'vue';
import { iteratee } from '../Utils/iteratee';

/**
 * Retorna o índice do último elemento de `array` para o qual `predicate`
 * (via `iteratee`) retorna valor verdadeiro, buscando de trás para
 * frente a partir de `fromIndex`, ou `-1` se nenhum casar. `fromIndex`
 * negativo conta a partir do final do array; valores fora do intervalo são
 * grampeados a `[0, length - 1]`.
 * Semelhante ao _.findLastIndex do Lodash.
 *
 * @param array array a percorrer
 * @param predicate condição a testar em cada elemento
 * @param fromIndex índice inicial da busca (padrão: último índice)
 * @returns o índice do último elemento que casa, ou `-1`
 */
export function findLastIndex<T>(array: MaybeRefOrGetter<T[] | null | undefined>, predicate?: unknown, fromIndex?: number): number {
    const data = toValue(array);
    const length = data == null ? 0 : data.length;
    if (!length) return -1;

    let start = length - 1;
    if (fromIndex !== undefined) start = fromIndex < 0 ? Math.max(length + fromIndex, 0) : Math.min(fromIndex, length - 1);

    const fn = iteratee(predicate) as (value: T, index: number, collection: unknown) => unknown;
    for (; start >= 0; start--) if (fn((data as T[])[start], start, data)) return start;
    return -1;
}
