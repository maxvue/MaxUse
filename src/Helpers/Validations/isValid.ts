import { size } from '../Iterables';

export function notEmpty<V>(value: V): value is NonNullable<V> {
    return size(value as any) > 0;
}

export function isNotEmpty<V>(value: V): value is NonNullable<V> {
    return size(value as any) > 0;
}

export function noEmpty<V>(value: V): value is NonNullable<V> {
    return size(value as any) > 0;
}

export function isEmpty<V>(value: V): value is NonNullable<V> {
    return size(value as any) === 0;
}

export function empty<V>(value: V): boolean {
    return size(value as any) === 0;
}

export function isValid<V>(value: V): value is NonNullable<V> {
    return value !== null && value !== undefined;
}

export function isNotValid<V>(value: V): value is Extract<V, null | undefined> {
    return !isValid(value);
}

export function notHasValidContent<V>(value: V): value is Extract<V, null | undefined> {
    return !isValid(value);
}

