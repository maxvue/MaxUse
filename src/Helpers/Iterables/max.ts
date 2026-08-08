import { toValue, type MaybeRefOrGetter } from 'vue';
import { baseExtremum } from './_baseExtremum';

/**
 * Calcula o valor máximo de `array`. Se `array` for vazio ou
 * `null`/`undefined`, retorna `undefined`. `Symbol` e `NaN` nunca vencem.
 * Semelhante ao _.max do Lodash.
 *
 * @param array array a inspecionar
 * @returns o valor máximo, ou `undefined`
 */
export function max<T>(array: MaybeRefOrGetter<T[] | null | undefined>): T | undefined {
    const data = toValue(array);
    if (!data || !data.length) return undefined;
    return baseExtremum(data, (value) => value, (a, b) => (a as number) > (b as number));
}
