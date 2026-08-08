import { toValue, type MaybeRefOrGetter } from 'vue';
import { iteratee } from '../Utils/iteratee';
import { keys } from './keys';

/**
 * Como `invert`, mas aceita `iterateeFn` (via `iteratee`) para derivar a
 * chave invertida a partir de cada valor, e agrupa **todas** as chaves
 * originais que produzem a mesma chave invertida em um array (em vez de
 * manter apenas a última).
 * Semelhante ao _.invertBy do Lodash.
 *
 * @param object objeto a inverter
 * @param iterateeFn função (ou shorthand) que deriva a chave invertida a partir do valor
 * @returns objeto invertido, com arrays de chaves originais agrupadas
 */
export function invertBy(object: MaybeRefOrGetter<unknown>, iterateeFn?: unknown): Record<string, string[]> {
    const data = toValue(object);
    const result: Record<string, string[]> = {};
    if (data == null) return result;

    const fn = iteratee(iterateeFn) as (value: unknown) => unknown;

    for (const key of keys(data)) {
        const value = (data as Record<string, unknown>)[key];
        const invertedKey = String(fn(value));
        if (result[invertedKey]) result[invertedKey].push(key);
        else result[invertedKey] = [key];
    }

    return result;
}
