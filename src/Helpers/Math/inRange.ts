import { toValue, type MaybeRefOrGetter } from 'vue';

/**
 * Converte um valor para número finito, grampeando `Infinity`/`-Infinity`
 * em `Number.MAX_VALUE`/`-Number.MAX_VALUE` e `NaN` em `0` — coerção
 * interna equivalente ao `toFinite` do Lodash.
 *
 * @param value valor a converter
 * @returns número finito resultante
 */
function toFiniteNumber(value: unknown): number {
    if (!value) return value === 0 ? (value as number) : 0;
    const num = Number(value);
    if (num === Infinity || num === -Infinity) return num < 0 ? -1.7976931348623157e+308 : 1.7976931348623157e+308;
    return num === num ? num : 0;
}

/**
 * Verifica se `number` está entre `start` (inclusivo) e `end` (exclusivo).
 * Se `end` for omitido, `start` vira `0` e o valor original de `start`
 * vira `end`.
 * Semelhante ao _.inRange do Lodash.
 *
 * @param number valor a verificar
 * @param start limite inferior (inclusivo), ou o limite superior se `end` for omitido
 * @param end limite superior (exclusivo)
 * @returns `true` se `number` estiver no intervalo
 */
export function inRange(number: MaybeRefOrGetter<number>, start: MaybeRefOrGetter<number>, end?: MaybeRefOrGetter<number>): boolean {
    let startNum = toFiniteNumber(toValue(start));
    let endNum: number;
    if (end === undefined) {
        endNum = startNum;
        startNum = 0;
    } else endNum = toFiniteNumber(toValue(end));


    const num = Number(toValue(number));

    if (startNum > endNum) {
        const temp = startNum;
        startNum = endNum;
        endNum = temp;
    }
    return num >= startNum && num < endNum;
}
