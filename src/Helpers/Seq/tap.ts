import { toValue, type MaybeRefOrGetter } from 'vue';

/**
 * Executa o interceptor com o valor e retorna o próprio valor.
 * Útil para inspecionar resultados intermediários numa cadeia.
 * Semelhante ao _.tap do Lodash.
 *
 * @param value O valor a ser repassado ao interceptor.
 * @param interceptor A função executada com o valor.
 * @returns O valor original.
 */
export function tap<T>(value: MaybeRefOrGetter<T>, interceptor: (value: T) => void): T {
    const data = toValue(value);
    interceptor(data);

    return data;
}
