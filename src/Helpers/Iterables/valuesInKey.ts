import { toValue, type MaybeRefOrGetter } from 'vue';

type T = Record<string, any> | any[] | null | undefined;

/**
 * Extracts and returns a flat array of values for a specified key from all objects in a collection.
 *
 * @template V - The expected type of the extracted values.
 * @param collection - A collection of objects (Array, Record, or Ref/getter).
 * @param key - The property key to extract from each item.
 * @param default_value - Fallback value to use if the key does not exist or is null/undefined (default: false).
 * @returns A flat array containing the extracted values.
 */
export function valuesInKey<V = any>(collection: MaybeRefOrGetter<T>, key: string, default_value: any = false): V[] {
    const data = toValue(collection);

    if (!data || typeof data !== 'object') return [];

    const items = Array.isArray(data) ? data : Object.values(data);

    return items.flatMap((list: any) => {
        const value = list[key] ?? default_value;
        if (Array.isArray(value)) return value;
        if (typeof value === 'object') return Object.values(value);
        return [value];
    });
}
