import { validateBr } from 'js-brasil';
import { type MaybeRefOrGetter, toValue } from 'vue';

/**
 * Valida se uma string é um CEP válido.
 *
 * @param value O valor a ser validado (string, Ref ou Getter).
 * @returns True se for um CEP válido, false caso contrário.
 */
export function cepIsValid(value: MaybeRefOrGetter<string | number | null | undefined>): boolean {
    const data = toValue(value);
    return validateBr.cep(data);
}

export const cep = cepIsValid;
export const isValidCep = cepIsValid;
export const isCepValid = cepIsValid;
export const hasValidCep = cepIsValid;