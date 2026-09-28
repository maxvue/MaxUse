import { toValue, type MaybeRefOrGetter } from 'vue';
import { isBlank } from '../Types';

type T = Record<string, any> | string | number | null | undefined;

/**
 * Gets the size of `value` by returning the length for array-like values
 * or the number of own enumerable properties for objects, Map, or Set.
 *
 * Distinct from Lodash: When `allow_number` is true (default), passing a number returns the number itself.
 *
 * @param value - The collection, string, object, number, Map, or Set to inspect.
 * @param allow_number - If true, returns the numeric value itself when `value` is a number (default: true).
 * @returns Returns the size or length of `value`.
 * @example
 * size([1, 2, 3]) // 3
 * size({ a: 1, b: 2 }) // 2
 * size('hello') // 5
 * size(42) // 42
 */
export function size(value: MaybeRefOrGetter<T>, allow_number: boolean = true): number {
    if (!value) return 0;

    const data: any = toValue(value);

    if (!data) return 0;

    if (isBlank(data, false)) return 0;

    if (typeof data === 'number' && allow_number) return data;

    if (Array.isArray(data) || typeof data === 'string') return data.length;

    if (data instanceof Map || data instanceof Set) return data.size;

    if (typeof data === 'object') return Object.keys(data).length;

    return data.length ?? 0;
}

