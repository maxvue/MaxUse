import { toValue, type MaybeRefOrGetter } from 'vue';
import { keys } from './keys';

/**
 * Cria um objeto invertendo chaves e valores de `object`: cada valor
 * (coagido para string) vira chave, associado à última chave que produziu
 * esse valor.
 * Semelhante ao _.invert do Lodash.
 *
 * @param object objeto a inverter
 * @returns objeto invertido
 */
export function invert(object: MaybeRefOrGetter<unknown>): Record<string, string> {
    const data = toValue(object);
    const result: Record<string, string> = {};
    if (data == null) return result;

    for (const key of keys(data)) result[String((data as Record<string, unknown>)[key])] = key;

    return result;
}
