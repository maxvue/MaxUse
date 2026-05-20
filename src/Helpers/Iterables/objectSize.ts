import { toValue, type MaybeRefOrGetter } from 'vue';
import { isBlank } from '../Types';

export function objectSize(object: MaybeRefOrGetter<any>): number {
    const value = toValue(object);

    if (!value) return 0;

    if (isBlank(value)) return 0;

    if (Array.isArray(object)) return 0;

    if (typeof value === 'object') return Object.keys(value).length as number;

    return 0;
}

export function isObjectValid<V>(value: V): value is Object & NonNullable<V> {
    return objectSize(value as any) > 0;
}