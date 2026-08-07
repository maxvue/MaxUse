import { toValue, type MaybeRefOrGetter } from 'vue';
import { isFunction } from '../Lang/isFunction';
import { keysIn } from './keysIn';

/**
 * Como `functions`, mas inclui também as propriedades **herdadas** via
 * protótipo cujos valores são funções.
 * Semelhante ao _.functionsIn do Lodash.
 *
 * @param object objeto a inspecionar
 * @returns array de nomes de método, próprios e herdados
 */
export function functionsIn(object: MaybeRefOrGetter<unknown>): string[] {
    const data = toValue(object);
    if (data == null) return [];

    return keysIn(data).filter((key) => isFunction((data as Record<string, unknown>)[key]));
}
