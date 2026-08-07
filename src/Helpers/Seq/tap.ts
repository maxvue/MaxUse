import { toValue, type MaybeRefOrGetter } from 'vue';

/**
 * Invoca `interceptor` com `value` como argumento, para efeito colateral, e retorna `value`.
 * Semelhante ao _.tap do Lodash.
 *
 * @param value valor a repassar ao interceptor e a retornar
 * @param interceptor função invocada com `value`
 * @returns o próprio `value`
 */
export function tap<T>(value: MaybeRefOrGetter<T>, interceptor: (value: T) => void): T {
    const data = toValue(value);
    interceptor(data);
    return data;
}
