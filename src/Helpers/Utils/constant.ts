import { toValue, type MaybeRefOrGetter } from 'vue';

/**
 * Cria uma função que sempre retorna `value`. O valor é resolvido uma
 * única vez, no momento da criação — chamadas subsequentes da função
 * retornada não reavaliam `value`.
 * Semelhante ao _.constant do Lodash.
 *
 * @param value valor a ser sempre retornado
 * @returns função que retorna `value`
 */
export function constant<T>(value: MaybeRefOrGetter<T>): () => T {
    const data = toValue(value);
    return () => data;
}
