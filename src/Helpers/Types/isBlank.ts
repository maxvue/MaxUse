import { hasContentFn } from './hasContent';

/**
 * Checks whether a value is blank (empty string, null, undefined, empty array/object/Map/Set).
 * Inverse of {@link hasContent}.
 *
 * @template V - The type of value being tested.
 * @param value - The value or ref to check.
 * @param if_zero - If true, treats the number 0 as NOT blank.
 * @returns True if the unwrapped value is blank.
 */
export function isBlank<V>(value: V, if_zero: boolean = false): boolean {
    return !hasContentFn(value as any, if_zero);
}

/**
 * Alias for {@link isBlank}. Checks whether a value is blank.
 *
 * @template V - The type of value being tested.
 * @param value - The value or ref to check.
 * @param if_zero - If true, treats the number 0 as NOT blank.
 * @returns True if the unwrapped value is blank.
 */
export function blank<V>(value: V, if_zero: boolean = false): boolean {
    return !hasContentFn(value as any, if_zero);
}