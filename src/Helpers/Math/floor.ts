import { toValue, type MaybeRefOrGetter } from 'vue';
import { createRound } from './_createRound';

/**
 * Arredonda `number` para baixo até `precision` casas decimais.
 * Semelhante ao _.floor do Lodash.
 *
 * @param number número a arredondar
 * @param precision casas decimais (padrão `0`; aceita valores negativos)
 * @returns número arredondado para baixo
 */
export function floor(number: MaybeRefOrGetter<number>, precision: MaybeRefOrGetter<number> = 0): number {
    const num = Number(toValue(number));
    const prec = toValue(precision) ?? 0;
    return createRound(num, prec, Math.floor);
}
