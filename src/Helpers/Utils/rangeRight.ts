import { toValue, type MaybeRefOrGetter } from 'vue';
import { toFinite } from '../Lang/toFinite';
import { baseRange } from './_baseRange';

/**
 * Igual a {@link import('./range').range}, mas gera o array na ordem
 * inversa (do último elemento para o primeiro), preservando a mesma
 * sequência de valores.
 * Semelhante ao _.rangeRight do Lodash.
 *
 * @param start início do intervalo, ou o fim se os demais forem omitidos
 * @param end fim do intervalo (exclusivo)
 * @param step incremento entre cada elemento
 * @returns array com os números do intervalo, gerado em ordem inversa
 */
export function rangeRight(start: MaybeRefOrGetter<number>, end?: MaybeRefOrGetter<number>, step?: MaybeRefOrGetter<number>): number[] {
    let startNum = toFinite(toValue(start));
    let endNum: number;
    if (end === undefined) {
        endNum = startNum;
        startNum = 0;
    } else endNum = toFinite(toValue(end));


    const stepNum = step === undefined ? (startNum < endNum ? 1 : -1) : toFinite(toValue(step));
    return baseRange(startNum, endNum, stepNum, true);
}
