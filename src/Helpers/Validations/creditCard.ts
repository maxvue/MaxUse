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
 * Faixas de BIN (6 primeiros dígitos) das bandeiras brasileiras que o `js-brasil`
 * não reconhece: Elo e Hipercard. Cada item é um intervalo fechado `[início, fim]`.
 *
 * Fonte: lista de faixas registrada no plano de implementação da issue #14.
 */
const BR_EXTRA_BINS: Array<[number, number]> = [
    // Elo
    [401178, 401179], [431274, 431274], [438935, 438935], [451416, 451416],
    [457393, 457393], [457631, 457632], [504175, 504175], [506699, 506778],
    [509000, 509999], [627780, 627780], [636297, 636297], [636368, 636368],
    [650031, 650051], [650405, 650439], [650485, 650538], [650541, 650598],
    [650700, 650718], [650720, 650727], [650901, 650978], [651652, 651679],
    [655000, 655019], [655021, 655058],
    // Hipercard
    [606282, 606282], [384100, 384199]
];

function matchesBrExtraBin(sanitized: string): boolean {
    if (sanitized.length < 13 || sanitized.length > 19) return false;

    const bin = Number(sanitized.slice(0, 6));
    return BR_EXTRA_BINS.some(([start, end]) => bin >= start && bin <= end);
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

    if (validateBr.cartaocredito(str)) return true;

    return matchesBrExtraBin(str.replace(/\D/g, ''));
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
