import { toValue, type MaybeRefOrGetter } from 'vue';
import { iteratee } from '../Utils/iteratee';

/**
 * Divide os elementos de `collection` em dois grupos: os que retornam
 * valor verdadeiro para `predicate` (via `iteratee`) e os que retornam
 * falso. Aceita array ou objeto, sempre retornando `[verdadeiros, falsos]`
 * como arrays.
 * Semelhante ao _.partition do Lodash.
 *
 * @param collection array ou objeto a percorrer
 * @param predicate condição a testar em cada elemento
 * @returns tupla `[elementos que casaram, elementos que não casaram]`
 */
export function partition<T>(collection: MaybeRefOrGetter<T[] | Record<string, T> | null | undefined>, predicate?: unknown): [T[], T[]] {
    const data = toValue(collection);
    const truthy: T[] = [];
    const falsy: T[] = [];
    if (data == null) return [truthy, falsy];

    const fn = iteratee(predicate) as (value: T, key: number | string, collection: unknown) => unknown;

    if (Array.isArray(data)) {
        data.forEach((item, index) => (fn(item, index, data) ? truthy : falsy).push(item));
        return [truthy, falsy];
    }

    for (const key of Object.keys(data)) {
        const value = (data as Record<string, T>)[key];
        (fn(value, key, data) ? truthy : falsy).push(value);
    }
    return [truthy, falsy];
}
