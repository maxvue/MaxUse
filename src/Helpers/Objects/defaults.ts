import { toValue, type MaybeRefOrGetter } from 'vue';
import { keysIn } from './keysIn';

/**
 * Assigns own and inherited enumerable string keyed properties of source objects to the
 * destination object for all destination properties that resolve to undefined.
 * Source objects are applied from left to right. Once a property is set, additional values of the same property are ignored.
 * Mutates and returns `object`.
 * Mirrors Lodash's `_.defaults`.
 *
 * @param object - The destination object (mutated in-place).
 * @param sources - The source objects.
 * @returns The destination object.
 */
export function defaults<T extends object>(object: MaybeRefOrGetter<T | null | undefined>, ...sources: Array<unknown | null | undefined>): T {
    const raw = toValue(object);
    const data = (raw == null ? {} : Object(raw)) as Record<PropertyKey, unknown>;

    for (const source of sources) {
        const rawSource = toValue(source);
        if (!rawSource) continue;
        for (const key of keysIn(rawSource)) if (data[key] === undefined) data[key] = (rawSource as Record<PropertyKey, unknown>)[key];

    }

    return data as T;
}
