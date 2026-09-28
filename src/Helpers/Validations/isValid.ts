import { toValue } from 'vue';
import { size } from '../Iterables';

/**
 * Checks whether a value is NOT empty (size > 0).
 * Uses {@link size} internally after unwrapping Vue reactivity with {@link toValue}.
 *
 * @param value - The value or ref to inspect.
 * @returns True if the unwrapped value has content (size > 0).
 */
export function notEmpty<V>(value: V): value is NonNullable<V> {
    const raw = toValue(value);
    if (typeof raw === 'boolean' || typeof raw === 'number') return true;
    return size(raw as any) > 0;
}

/**
 * Checks whether a value is NOT empty (size > 0).
 * Semantic alias for {@link notEmpty}.
 *
 * @param value - The value or ref to inspect.
 * @returns True if the unwrapped value has content (size > 0).
 */
export function isNotEmpty<V>(value: V): value is NonNullable<V> {
    const raw = toValue(value);
    if (typeof raw === 'boolean' || typeof raw === 'number') return true;
    return size(raw as any) > 0;
}

/**
 * Checks whether a value is NOT empty.
 * Alias for {@link notEmpty}.
 *
 * @param value - The value or ref to inspect.
 * @returns True if the unwrapped value has content (size > 0).
 */
export function noEmpty<V>(value: V): value is NonNullable<V> {
    const raw = toValue(value);
    if (typeof raw === 'boolean' || typeof raw === 'number') return true;
    return size(raw as any) > 0;
}

/**
 * Checks whether a value is empty (size === 0).
 * Inverse of {@link notEmpty}. Unwraps Vue reactivity with {@link toValue}.
 *
 * NOTE: booleans and numbers (including `0` and `false`) are never considered empty.
 * To treat `0` or empty strings as absent values, use {@link isBlank}.
 *
 * @param value - The value or ref to inspect.
 * @returns True if the unwrapped value is empty (size === 0).
 */
export function isEmpty<V>(value: V): boolean {
    const raw = toValue(value);
    if (typeof raw === 'boolean' || typeof raw === 'number') return false;
    return size(raw as any) === 0;
}

/**
 * Checks whether a value is empty (size === 0).
 * Simplified alias for {@link isEmpty}.
 *
 * @param value - The value or ref to inspect.
 * @returns True if the unwrapped value is empty (size === 0).
 */
export function empty<V>(value: V): boolean {
    const raw = toValue(value);
    if (typeof raw === 'boolean' || typeof raw === 'number') return false;
    return size(raw as any) === 0;
}

/**
 * Checks whether a value is valid (neither null nor undefined).
 * Unwraps Vue reactivity with {@link toValue}.
 *
 * @param value - The value or ref to inspect.
 * @returns True if the unwrapped value is not null and not undefined.
 */
export function isValid<V>(value: V): value is NonNullable<V> {
    const raw = toValue(value);
    return raw !== null && raw !== undefined;
}

/**
 * Checks whether a value is NOT valid (either null or undefined).
 * Inverse of {@link isValid}.
 *
 * @param value - The value or ref to inspect.
 * @returns True if the unwrapped value is null or undefined.
 */
export function isNotValid<V>(value: V): value is Extract<V, null | undefined> {
    return !isValid(value);
}

/**
 * Checks whether a value does NOT have valid content (either null or undefined).
 * Alias for {@link isNotValid}.
 *
 * @param value - The value or ref to inspect.
 * @returns True if the unwrapped value is null or undefined.
 */
export function notHasValidContent<V>(value: V): value is Extract<V, null | undefined> {
    return !isValid(value);
}

