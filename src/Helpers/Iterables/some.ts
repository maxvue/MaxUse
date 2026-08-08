import { toValue, type MaybeRefOrGetter } from 'vue';
import { iteratee } from '../Utils/iteratee';

/**
 * Verifica se **algum** elemento de `collection` retorna valor verdadeiro
 * para `predicate` (via `iteratee`). Coleção vazia sempre retorna `false`.
 * A iteração para assim que encontrar o primeiro elemento verdadeiro.
 * Semelhante ao _.some do Lodash.
 *
 * @param collection array ou objeto a percorrer
 * @param predicate condição a testar em cada elemento
 * @returns `true` se algum elemento casar
 */
export function some<T>(collection: MaybeRefOrGetter<T[] | Record<string, T> | null | undefined>, predicate?: unknown): boolean {
    const data = toValue(collection);
    if (data == null) return false;

    const fn = iteratee(predicate) as (value: T, key: number | string, collection: unknown) => unknown;

    if (Array.isArray(data)) return data.some((item, index) => fn(item, index, data));

    return Object.keys(data).some((key) => fn((data as Record<string, T>)[key], key, data));
}
