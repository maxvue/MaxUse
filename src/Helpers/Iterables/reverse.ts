import { toValue, type MaybeRefOrGetter } from 'vue';

/**
 * Reverses `array` so that the first element becomes the last, the second becomes the second to last, and so on.
 * Note that this method **mutates** the source array, similar to `Array#reverse` and Lodash's `_.reverse`.
 *
 * @param array - The array to reverse (mutated in-place).
 * @returns Returns the reversed array.
 * @example
 * const array = [1, 2, 3];
 * reverse(array); // [3, 2, 1]
 */
export function reverse<T>(array: MaybeRefOrGetter<T[] | null | undefined>): T[] | null | undefined {
    const data = toValue(array);
    if (data == null) return data;
    return data.reverse();
}
