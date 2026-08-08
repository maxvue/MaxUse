import { toValue, type MaybeRefOrGetter } from 'vue';
import { toFinite } from '../Lang/toFinite';
import { baseRange } from './_baseRange';

/**
 * Cria um array de números de `start` até `end` (exclusivo), incrementando
 * `step` a cada elemento. Se `end` for omitido, `start` vira o limite
 * superior e o inferior vira `0`. `step` negativo é inferido
 * automaticamente quando `start` > `end`.
 * Semelhante ao _.range do Lodash.
 *
 * @param start início do intervalo, ou o fim se os demais forem omitidos
 * @param end fim do intervalo (exclusivo)
 * @param step incremento entre cada elemento
 * @returns array com os números do intervalo
 */
export function range(start: MaybeRefOrGetter<number>, end?: MaybeRefOrGetter<number>, step?: MaybeRefOrGetter<number>): number[] {
    let startNum = toFinite(toValue(start));
    let endNum: number;
    if (end === undefined) {
        endNum = startNum;
        startNum = 0;
    } else endNum = toFinite(toValue(end));


    const stepNum = step === undefined ? (startNum < endNum ? 1 : -1) : toFinite(toValue(step));
    return baseRange(startNum, endNum, stepNum, false);
}
