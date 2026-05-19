import { toValue, type MaybeRefOrGetter } from 'vue';

export function isset<T extends object, K extends PropertyKey>(obj: MaybeRefOrGetter<any>, key: K): obj is T & Record<K, NonNullable<unknown>> {
    const value = toValue(obj);

    if (!value) return false;

    return (
        typeof obj === 'object' &&
        obj !== null &&
        key in obj &&
        (obj as Record<K, unknown>)[key] != null
    );

}

export const isSet = isset;
export const hasKey = isset;
export const keyExists = isset;
export const keyExist = isset;
