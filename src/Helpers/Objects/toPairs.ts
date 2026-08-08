import { toValue, type MaybeRefOrGetter } from 'vue';
import { keys } from './keys';

/**
 * Converte um objeto em um array de pares `[chave, valor]`, considerando
 * apenas propriedades próprias enumeráveis.
 * Semelhante ao _.toPairs do Lodash.
 *
 * @param object objeto a converter
 * @returns array de pares `[chave, valor]`
 */
export function toPairs<T = unknown>(object: MaybeRefOrGetter<unknown>): Array<[string, T]> {
    const data = toValue(object);
    if (data == null) return [];

    return keys(data).map((key) => [key, (data as Record<string, T>)[key]]);
}
