import { toValue, type MaybeRefOrGetter } from 'vue';
import { toFinite } from './toFinite';

/**
 * Converte um valor para um inteiro, truncando a parte fracionária.
 * Semelhante ao _.toInteger do Lodash.
 *
 * @param value valor a converter
 * @returns inteiro resultante
 */
export function toInteger(value: MaybeRefOrGetter<unknown>): number {
    const data = toValue(value);
    const result = toFinite(data);
    const remainder = result % 1;
    return result === result ? (remainder ? result - remainder : result) : 0;
}
