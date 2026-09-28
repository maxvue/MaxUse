import { toValue, type MaybeRefOrGetter } from 'vue';
import { isBlank } from '../Types';

/**
 * Returns the number of own enumerable keys in an object.
 * Returns 0 for null, empty, arrays, or non-object values.
 *
 * @param object - The object or ref to calculate size for.
 * @returns Number of own keys, or 0 if not a valid object.
 */
export function objectSize(object: MaybeRefOrGetter<any>): number {
    const value = toValue(object);

    if (!value) return 0;

    if (isBlank(value)) return 0;

    if (Array.isArray(value)) return 0;

    if (typeof value === 'object') return Object.keys(value).length as number;

    return 0;
}

/**
 * Type-guard that checks whether a value is a valid non-empty object with at least one key.
 *
 * @param value - The value to inspect.
 * @returns True if value is a non-empty object (objectSize > 0).
 */
export function isObjectValid<V>(value: V): value is Object & NonNullable<V> {
    return objectSize(value as any) > 0;
}