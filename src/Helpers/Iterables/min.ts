import { toValue, type MaybeRefOrGetter } from 'vue';
import { baseExtremum } from './_baseExtremum';

/**
 * Calcula o valor mínimo de `array`. Se `array` for vazio ou
 * `null`/`undefined`, retorna `undefined`. `Symbol` e `NaN` nunca vencem.
 * Semelhante ao _.min do Lodash.
 *
 * @param array array a inspecionar
 * @returns o valor mínimo, ou `undefined`
 */
export function min<T>(array: MaybeRefOrGetter<T[] | null | undefined>): T | undefined {
    const data = toValue(array);
    if (!data || !data.length) return undefined;
    return baseExtremum(data, (value) => value, (a, b) => (a as number) < (b as number));
}
