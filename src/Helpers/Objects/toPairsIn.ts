import { toValue, type MaybeRefOrGetter } from 'vue';
import { keysIn } from './keysIn';

/**
 * Converte um objeto em um array de pares `[chave, valor]`, incluindo
 * propriedades herdadas via protótipo.
 * Semelhante ao _.toPairsIn do Lodash.
 *
 * @param object objeto a converter
 * @returns array de pares `[chave, valor]`, próprios e herdados
 */
export function toPairsIn<T = unknown>(object: MaybeRefOrGetter<unknown>): Array<[string, T]> {
    const data = toValue(object);
    if (data == null) return [];

    return keysIn(data).map((key) => [key, (data as Record<string, T>)[key]]);
}
