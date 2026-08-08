import { toValue, type MaybeRefOrGetter } from 'vue';
import { baseMerge } from './_baseMerge';

/**
 * Mescla profundamente as propriedades próprias e herdadas de cada
 * objeto em `sources` em `object`. Arrays e outras coleções são mescladas
 * por índice (não concatenadas); `undefined` em `sources` nunca
 * sobrescreve um valor já presente em `object`. Muta e retorna `object`.
 * Semelhante ao _.merge do Lodash.
 *
 * @param object objeto de destino (mutado in-place)
 * @param sources objetos fonte, aplicados em ordem
 * @returns o próprio `object`
 */
export function merge<T extends object>(object: MaybeRefOrGetter<T | null | undefined>, ...sources: Array<unknown | null | undefined>): T {
    const raw = toValue(object);
    const data = (raw == null ? {} : Object(raw)) as T;
    for (const source of sources) baseMerge(data, source);
    return data;
}
