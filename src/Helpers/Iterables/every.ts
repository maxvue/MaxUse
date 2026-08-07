import { toValue, type MaybeRefOrGetter } from 'vue';
import { iteratee } from '../Utils/iteratee';

/**
 * Verifica se **todos** os elementos de `collection` retornam valor
 * verdadeiro para `predicate` (via `iteratee`). Coleção vazia sempre
 * retorna `true`. A iteração para assim que encontrar o primeiro
 * elemento falso.
 * Semelhante ao _.every do Lodash.
 *
 * @param collection array ou objeto a percorrer
 * @param predicate condição a testar em cada elemento
 * @returns `true` se todos os elementos casarem
 */
export function every<T>(collection: MaybeRefOrGetter<T[] | Record<string, T> | null | undefined>, predicate?: unknown): boolean {
    const data = toValue(collection);
    if (data == null) return true;

    const fn = iteratee(predicate) as (value: T, key: number | string, collection: unknown) => unknown;

    if (Array.isArray(data)) return data.every((item, index) => fn(item, index, data));

    return Object.keys(data).every((key) => fn((data as Record<string, T>)[key], key, data));
}
