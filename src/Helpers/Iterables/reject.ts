import { toValue, type MaybeRefOrGetter } from 'vue';
import { iteratee } from '../Utils/iteratee';

/**
 * O oposto de `filter`: retorna os elementos de `collection` para os
 * quais `predicate` (via `iteratee`) retorna valor **falso**. Aceita array
 * ou objeto, sempre retornando um array.
 * Semelhante ao _.reject do Lodash.
 *
 * @param collection array ou objeto a percorrer
 * @param predicate condição a testar em cada elemento
 * @returns array com os elementos que não casaram
 */
export function reject<T>(collection: MaybeRefOrGetter<T[] | Record<string, T> | null | undefined>, predicate?: unknown): T[] {
    const data = toValue(collection);
    if (data == null) return [];

    const fn = iteratee(predicate) as (value: T, key: number | string, collection: unknown) => unknown;

    if (Array.isArray(data)) return data.filter((item, index) => !fn(item, index, data));

    return Object.keys(data).filter((key) => !fn((data as Record<string, T>)[key], key, data)).map((key) => (data as Record<string, T>)[key]);
}
