import { toValue, type MaybeRefOrGetter } from 'vue';

/**
 * Casts `value` as an array if it is not already one.
 * When called with no arguments, returns an empty array.
 * Mirrors Lodash's `_.castArray`.
 *
 * @param value - The value to cast as an array.
 * @returns The original array or a new array wrapping `value`.
 */
export function castArray(): any[];
export function castArray<T>(value: MaybeRefOrGetter<T[]>): T[];
export function castArray<T>(value: MaybeRefOrGetter<T>): T[];
export function castArray<T>(value?: MaybeRefOrGetter<T | T[]>): T[] {
    if (arguments.length === 0) return [];
    const data = toValue(value as any);
    return Array.isArray(data) ? (data as T[]) : [data as T];
}
