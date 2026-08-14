import { toValue, type MaybeRefOrGetter } from 'vue';
import { keysIn } from './keysIn';
import { baseAssignValue } from './_baseAssignValue';

/**
 * Como `assign`, mas atribui também as propriedades **herdadas** via
 * protótipo de cada objeto em `sources`. Muta e retorna `object`.
 * Semelhante ao _.assignIn do Lodash.
 *
 * @param object objeto de destino (mutado in-place)
 * @param sources objetos fonte, aplicados em ordem
 * @returns o próprio `object`
 */
export function assignIn<T extends object>(object: MaybeRefOrGetter<T | null | undefined>, ...sources: Array<unknown | null | undefined>): T {
    const raw = toValue(object);
    const data = (raw == null ? {} : Object(raw)) as T;
    for (const source of sources) {
        if (!source) continue;
        for (const key of keysIn(source)) baseAssignValue(data as Record<PropertyKey, unknown>, key, (source as Record<PropertyKey, unknown>)[key]);
    }
    return data;
}
