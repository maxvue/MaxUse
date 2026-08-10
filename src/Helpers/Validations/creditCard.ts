import { validateBr } from 'js-brasil';
import { type MaybeRefOrGetter, toValue } from 'vue';
import { isBlank } from '../Types/isBlank';

function checkLuhn(cardNumber: string): boolean {
    const sanitized = cardNumber.replace(/\D/g, '');
    if (!sanitized || /^0+$/.test(sanitized)) return false;

    let sum = 0;
    let shouldDouble = false;

    for (let i = sanitized.length - 1; i >= 0; i--) {
        let digit = parseInt(sanitized.charAt(i), 10);
        if (shouldDouble) {
            digit *= 2;
            if (digit > 9) digit -= 9;
        }
        sum += digit;
        shouldDouble = !shouldDouble;
    }

    return sum % 10 === 0;
}

/**
 * Valida se um número de cartão de crédito é válido (algoritmo de Luhn).
 *
 * @param value O valor a ser validado (string, number, Ref ou Getter).
 * @returns True se for um número de cartão de crédito válido, false caso contrário.
 */
export function isValidCreditCard(value: MaybeRefOrGetter<string | number | null | undefined>): boolean {
    const data = toValue(value);
    if (isBlank(data)) return false;

    const str = String(data);
    if (!checkLuhn(str)) return false;

    return validateBr.cartaocredito(str);
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
