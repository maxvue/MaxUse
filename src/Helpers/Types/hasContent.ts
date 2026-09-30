import { toValue, type MaybeRefOrGetter } from 'vue';

type RefAny = MaybeRefOrGetter<any>;

/**
 * Checks whether a value has content (is not null, undefined, empty string/array/object/Map/Set).
 *
 * @param value - The value or ref to check.
 * @param if_zero - Whether numeric 0 should be treated as having content (default: false).
 * @returns True if the unwrapped value contains data.
 */
export function hasContentFn(value: RefAny, if_zero: boolean = false): boolean {
    const data: any = toValue(value);

    if (!data && data !== 0) return false;

    if (typeof data === 'string') {
        const lower = data.trim().toLowerCase();
        if (lower === '' || lower === 'null' || lower === 'undefined' || lower === 'none' || lower === 'nan' || lower === 'false') return false;

        return true;
    }

    if (typeof data === 'number') return data === 0 ? if_zero : true;
    if (Array.isArray(data)) return data.length > 0;
    if (data instanceof Map || data instanceof Set) return data.size > 0;
    if (String(data) !== '[object Object]') return String(data).length > 0;
    if (typeof data === 'object') return Object.keys(data).length > 0;
    return data.length > 0;
}

/**
 * Type-guard checking whether a value has content.
 * Returns true and narrows the type to `NonNullable<V>` when the value contains valid data.
 *
 * @template V - The type of value being tested.
 * @param value - The value or ref to check.
 * @param if_zero - If true, treats the number 0 as having content (default: false).
 * @returns True if the value contains data (narrows to NonNullable).
 */
export function hasContent<V>(value: V, if_zero: boolean = false): value is NonNullable<V> {
    return hasContentFn(value as any, if_zero);
}