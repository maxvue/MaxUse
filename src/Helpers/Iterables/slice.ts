import { toValue, type MaybeRefOrGetter } from 'vue';
import { toInteger } from '../Lang/toInteger';

/**
 * Extrai uma fatia do array entre `start` e `end` (exclusivo). Diferente do
 * `Array#slice` nativo, os limites passam por `toInteger`, então aceitam
 * valores não numéricos que são coagidos (ex.: `'1'`, `NaN`).
 * Semelhante ao _.slice do Lodash.
 *
 * @param array array de entrada
 * @param start índice inicial (padrão `0`)
 * @param end índice final, exclusivo (padrão `array.length`)
 * @returns novo array com a fatia extraída
 */
export function slice<T>(array: MaybeRefOrGetter<T[] | null | undefined>, start?: number, end?: number): T[] {
    const data = toValue(array);
    const length = data == null ? 0 : data.length;
    if (!length) return [];

    const from = start == null ? 0 : toInteger(start);
    const to = end === undefined ? length : toInteger(end);

    return data!.slice(from, to);
}
