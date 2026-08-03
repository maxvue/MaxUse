import { validateBr } from 'js-brasil';
import { type MaybeRefOrGetter, toValue } from 'vue';
import { isBlank } from '../Types/isBlank';

/**
 * Valida se um número de cartão de crédito é válido (algoritmo de Luhn).
 *
 * @param value O valor a ser validado (string, number, Ref ou Getter).
 * @returns True se for um número de cartão de crédito válido, false caso contrário.
 */
export function isValidCreditCard(value: MaybeRefOrGetter<string | number | null | undefined>): boolean {
    const data = toValue(value);
    if (isBlank(data)) return false;
    return validateBr.cartaocredito(data);
}

/** Alias de {@link isValidCreditCard}. */
export const creditCardIsValid = isValidCreditCard;
/** Alias de {@link isValidCreditCard}. */
export const creditCard = isValidCreditCard;
/** Alias de {@link isValidCreditCard}. */
export const isCreditCard = isValidCreditCard;
/** Alias de {@link isValidCreditCard}. */
export const hasValidCreditCard = isValidCreditCard;
/** Alias de {@link isValidCreditCard}. */
export const validCreditCard = isValidCreditCard;
