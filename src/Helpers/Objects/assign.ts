import { toValue, type MaybeRefOrGetter } from 'vue';
import { keys } from './keys';
import { baseAssignValue } from './_baseAssignValue';

/**
 * Assigns own enumerable string keyed properties of source objects to the destination object.
 * Source objects are applied from left to right. Subsequent sources overwrite property assignments of previous sources.
 * Mutates and returns `object`. If `object` is null/undefined, it is coerced to an empty object.
 * Mirrors Lodash's `_.assign`.
 *
 * @param object - The destination object (mutated in-place).
 * @param sources - The source objects.
 * @returns The destination object.
 */
export function assign<T extends object>(object: MaybeRefOrGetter<T | null | undefined>, ...sources: Array<unknown | null | undefined>): T {
    const raw = toValue(object);
    const data = (raw == null ? {} : Object(raw)) as T;
    for (const source of sources) {
        const rawSource = toValue(source);
        if (!rawSource) continue;
        for (const key of keys(rawSource)) baseAssignValue(data as Record<PropertyKey, unknown>, key, (rawSource as Record<PropertyKey, unknown>)[key]);
    }
    return data;
}
