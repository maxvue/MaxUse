import { toValue, type MaybeRefOrGetter } from 'vue';
import { iteratee } from '../Utils/iteratee';

/**
 * Retorna o índice do primeiro elemento de `array` para o qual `predicate`
 * (via `iteratee`) retorna valor verdadeiro, ou `-1` se nenhum casar.
 * `fromIndex` negativo conta a partir do final do array.
 * Semelhante ao _.findIndex do Lodash.
 *
 * @param array array a percorrer
 * @param predicate condição a testar em cada elemento
 * @param fromIndex índice inicial (padrão `0`; negativo conta do fim)
 * @returns o índice do primeiro elemento que casa, ou `-1`
 */
export function findIndex<T>(array: MaybeRefOrGetter<T[] | null | undefined>, predicate?: unknown, fromIndex = 0): number {
    const data = toValue(array);
    if (data == null) return -1;

    const length = data.length;
    let start = fromIndex < 0 ? Math.max(length + fromIndex, 0) : fromIndex;
    const fn = iteratee(predicate) as (value: T, index: number, collection: unknown) => unknown;

    for (; start < length; start++) if (fn(data[start], start, data)) return start;
    return -1;
}
