import { toValue, type MaybeRefOrGetter } from 'vue';

/**
 * Removes all provided values from an array using SameValueZero for equality comparisons.
 * Mutates the input array in-place.
 * Mirrors Lodash's `_.pull`.
 *
 * @param array - The array to modify (mutated in-place).
 * @param values - The values to remove.
 * @returns The mutated array.
 */
export function pull<T>(array: MaybeRefOrGetter<T[]>, ...values: T[]): T[];
export function pull<T>(array: MaybeRefOrGetter<T[] | null | undefined>, ...values: T[]): T[] | null | undefined;
export function pull<T>(array: MaybeRefOrGetter<T[] | null | undefined>, ...values: T[]): T[] | null | undefined {
    const data = toValue(array);
    if (!data || !data.length || !values.length) return data;

    const excluded = new Set<T>(values);

    for (let index = data.length - 1; index >= 0; index--) if (excluded.has(data[index])) data.splice(index, 1);

    return data;
}
