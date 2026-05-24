import { toValue, type MaybeRefOrGetter } from 'vue';
import { isBlank } from './isBlank';

type RefAny = MaybeRefOrGetter<any>;

/**
 * Verifica se um valor é um número válido.
 *
 * @param value O valor a ser verificado.
 * @returns Retorna true se for um número.
 */
export function isNumber(value: RefAny): boolean {
    const data = toValue(value);
    if (isBlank(data, true)) return false;
    if (typeof data === 'string' && String(data).trim() === '') return false;
    if (typeof data === 'boolean') return false;
    return !Number.isNaN(Number(data));
}

/** Alias de {@link isNumber}. */
export const isNumeric = isNumber;
/** Alias de {@link isNumber}. */
export const numeric = isNumber;
