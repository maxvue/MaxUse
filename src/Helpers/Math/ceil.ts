import { toValue, type MaybeRefOrGetter } from 'vue';
import { createRound } from './_createRound';

/**
 * Arredonda `number` para cima até `precision` casas decimais.
 * Semelhante ao _.ceil do Lodash.
 *
 * @param number número a arredondar
 * @param precision casas decimais (padrão `0`; aceita valores negativos)
 * @returns número arredondado para cima
 */
export function ceil(number: MaybeRefOrGetter<number>, precision: MaybeRefOrGetter<number> = 0): number {
    const num = Number(toValue(number));
    const prec = toValue(precision) ?? 0;
    return createRound(num, prec, Math.ceil);
}
