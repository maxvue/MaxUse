import { validateBr } from 'js-brasil';
import { type MaybeRefOrGetter, toValue } from 'vue';
import { isBlank } from '../Types/isBlank';

/**
 * Valida se uma string é um CEP válido.
 *
 * @param value O valor a ser validado (string, Ref ou Getter).
 * @returns True se for um CEP válido, false caso contrário.
 */
export function cepIsValid(value: MaybeRefOrGetter<string | number | null | undefined>): boolean {
    const data = toValue(value);
    if (isBlank(data)) return false;

    const str = typeof data === 'number' ? String(data).padStart(8, '0') : String(data);
    const digitsOnly = str.replace(/\D/g, '');
    if (digitsOnly.length !== 8) return false;

    // O CEP zerado é o único valor garantidamente não atribuído pelos Correios.
    // Sequências como 11111111 ou 22222222 caem em faixas reais (SP, RJ...) e por
    // isso NÃO são rejeitadas — ao contrário de CPF/CNPJ, o CEP não tem dígito
    // verificador e rejeitar dígitos repetidos produziria falso negativo.
    if (/^0{8}$/.test(digitsOnly)) return false;

    return validateBr.cep(str);
}

export const cep = cepIsValid;
export const isValidCep = cepIsValid;
export const isCepValid = cepIsValid;
export const hasValidCep = cepIsValid;