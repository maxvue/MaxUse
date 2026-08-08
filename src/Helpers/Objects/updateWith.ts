import { toValue, type MaybeRefOrGetter } from 'vue';
import { baseGet } from '../Utils/_baseGet';
import { baseSet } from './_baseSet';

/**
 * Como `update`, mas aceita `customizer` para produzir as estruturas
 * intermediárias criadas ao longo do `path` (mesma semântica de
 * `setWith`).
 * Semelhante ao _.updateWith do Lodash.
 *
 * @param object objeto a modificar (mutado in-place)
 * @param path caminho da propriedade a atualizar
 * @param updater função que recebe o valor atual e retorna o novo valor
 * @param customizer função opcional `(nsValue, key, nsObject) => estrutura`
 * @returns o próprio `object`
 */
export function updateWith<T>(
    object: MaybeRefOrGetter<T | null | undefined>,
    path: MaybeRefOrGetter<unknown>,
    updater: (currentValue: unknown) => unknown,
    customizer?: (nsValue: unknown, key: PropertyKey, nsObject: unknown) => unknown
): T | null | undefined {
    const data = toValue(object);
    if (data == null) return data;
    const key = toValue(path);
    return baseSet(data, key, updater(baseGet(data, key)), customizer);
}
