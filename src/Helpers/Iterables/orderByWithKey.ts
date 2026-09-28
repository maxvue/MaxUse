import { type MaybeRefOrGetter } from 'vue';
import { keyBy } from './keyBy';
import { orderBy } from './orderBy';

type T = Record<string, any>;
type OrderCriteria<T> = keyof T | (keyof T)[] | { [K in keyof T]?: 'asc' | 'desc' };

/**
 * Sorts a collection of objects by criteria, then indexes the sorted results by a specified key.
 *
 * @param collection - The collection of objects to sort and index.
 * @param criteria - Sort criteria (property key, array of keys, or `{ [key]: 'asc' | 'desc' }`).
 * @param object_keyBy - The object key to index the resulting Record by.
 * @param order - Sort direction when criteria does not specify ('asc' or 'desc', default: 'asc').
 * @returns A Record indexed by `object_keyBy`.
 * @example
 * const users = [{ id: 1, name: 'Bob', age: 30 }, { id: 2, name: 'Alice', age: 25 }];
 * const result = orderByWithKey(users, 'age', 'id');
 * // { '2': { id: 2, name: 'Alice', age: 25 }, '1': { id: 1, name: 'Bob', age: 30 } }
 */
export function orderByWithKey(
    collection: MaybeRefOrGetter<T[] | Record<string, T> | null | undefined>,
    criteria: OrderCriteria<T>,
    object_keyBy: keyof T,
    order: 'asc' | 'desc' = 'asc'
): Record<string, T> {

    // Converte o formato objeto { key: 'asc'|'desc' } para arrays separados
    let keys: string[];
    let orders: ('asc' | 'desc')[];

    if (typeof criteria === 'object' && !Array.isArray(criteria) && criteria !== null) {
        keys = Object.keys(criteria);
        orders = keys.map((k) => (criteria as Record<string, 'asc' | 'desc'>)[k] ?? order);
    } else {
        keys = Array.isArray(criteria) ? criteria as string[] : [criteria as string];
        orders = keys.map(() => order);
    }

    const in_order = orderBy(collection, keys, orders);
    return keyBy(in_order, object_keyBy) as Record<string, T>;
}
