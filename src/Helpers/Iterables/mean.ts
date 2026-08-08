import { toValue, type MaybeRefOrGetter } from 'vue';

/**
 * Calcula a média aritmética dos valores de `array`. Retorna `NaN` se
 * `array` for vazio, `null` ou `undefined`.
 * Semelhante ao _.mean do Lodash.
 *
 * @param array array de números
 * @returns a média, ou `NaN`
 */
export function mean(array: MaybeRefOrGetter<number[] | null | undefined>): number {
    const data = toValue(array);
    const length = data == null ? 0 : data.length;
    if (!length) return NaN;

    let sum = 0;
    for (const value of data as number[]) sum += value;
    return sum / length;
}
