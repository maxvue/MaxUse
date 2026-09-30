import { toValue, type MaybeRefOrGetter } from 'vue';

/**
 * Checks whether a given object is iterable (implements `[Symbol.iterator]`).
 *
 * @template T - The element type of the iterable.
 * @param obj - The object or ref/getter to check.
 * @returns True if the unwrapped object is iterable.
 */
export function canIterate<T>(obj: MaybeRefOrGetter<any>): obj is Iterable<T> {
    const data = toValue(obj);
    return typeof data?.[Symbol.iterator] === 'function';
}

/**
 * Alias for {@link canIterate}. Checks whether an object is iterable.
 */
export const isIterable = canIterate;
