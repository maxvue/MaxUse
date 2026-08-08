import { toValue, type MaybeRefOrGetter } from 'vue';
import { keysIn } from './keysIn';

/**
 * Retorna os valores enumeráveis de um objeto, incluindo os herdados via
 * protótipo.
 * Semelhante ao _.valuesIn do Lodash.
 *
 * @param object objeto, array ou string
 * @returns array de valores, próprios e herdados
 */
export function valuesIn<T = unknown>(object: MaybeRefOrGetter<unknown>): T[] {
    const data = toValue(object);
    if (data == null) return [];

    return keysIn(data).map((key) => (data as Record<string, T>)[key]);
}
