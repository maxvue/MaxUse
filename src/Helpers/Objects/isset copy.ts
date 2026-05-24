import { toValue, type MaybeRefOrGetter } from 'vue';

/**
 * Verifica se um objeto possui uma determinada chave com valor não-nulo (type-guard).
 * Inspirado no `isset()` do PHP.
 *
 * @param obj - O objeto a ser verificado (aceita Ref ou Getter).
 * @param key - A chave a ser buscada no objeto.
 * @returns true se a chave existir e seu valor não for null/undefined.
 */
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

/** Alias de {@link isset}. */
export const isSet = isset;
/** Alias de {@link isset}. */
export const hasKey = isset;
/** Alias de {@link isset}. */
export const keyExists = isset;
/** Alias de {@link isset}. */
export const keyExist = isset;
