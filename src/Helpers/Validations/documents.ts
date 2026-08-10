import { validateBr } from 'js-brasil';
import { type MaybeRefOrGetter, toValue } from 'vue';
import { isBlank } from '../Types/isBlank';

type RefString = MaybeRefOrGetter<string | number | null | undefined>;

/**
 * Valida se uma string é um CPF válido (com cálculo dos dígitos verificadores).
 *
 * @param value - O CPF a ser validado (aceita com ou sem máscara, Ref ou Getter).
 * @returns true se for um CPF válido, false caso contrário.
 */
export function isCpf(value: RefString): boolean {
    const data = toValue(value);
    if (isBlank(data)) return false;
    const str = typeof data === 'number' ? String(data).padStart(11, '0') : String(data);
    return validateBr.cpf(str);
}

/**
 * Valida se uma string é um CNPJ válido (com cálculo dos dígitos verificadores).
 *
 * @param value - O CNPJ a ser validado (aceita com ou sem máscara, Ref ou Getter).
 * @returns true se for um CNPJ válido, false caso contrário.
 */
export function isCnpj(value: RefString): boolean {
    const data = toValue(value);
    if (isBlank(data)) return false;
    const str = typeof data === 'number' ? String(data).padStart(14, '0') : String(data);
    return validateBr.cnpj(str);
}

/**
 * Valida se uma string é um CPF ou CNPJ válido (detecta automaticamente pelo tamanho).
 *
 * @param value - O documento a ser validado (aceita com ou sem máscara, Ref ou Getter).
 * @returns true se for um CPF ou CNPJ válido, false caso contrário.
 */
export function isCpfCnpj(value: RefString): boolean {
    const data = toValue(value);
    if (isBlank(data)) return false;
    const digitsOnly = String(data).replace(/\D/g, '');
    if (typeof data === 'number') {
        const str = digitsOnly.length <= 11 ? digitsOnly.padStart(11, '0') : digitsOnly.padStart(14, '0');
        return validateBr.cpfcnpj(str);
    }
    return validateBr.cpfcnpj(String(data));
}

/** Alias de {@link isCpf}. */
export const cpf = isCpf;
/** Alias de {@link isCnpj}. */
export const cnpj = isCnpj;
/** Alias de {@link isCpfCnpj}. */
export const cpfcnpj = isCpfCnpj;
/** Alias de {@link isCpf}. */
export const cpfIsValid = isCpf;
/** Alias de {@link isCnpj}. */
export const cnpjIsValid = isCnpj;
/** Alias de {@link isCpfCnpj}. */
export const cpfCnpjIsValid = isCpfCnpj;
/** Alias de {@link isCpfCnpj}. */
export const isCpfOrCnpj = isCpfCnpj;
/** Alias de {@link isCpfCnpj}. */
export const cpfOrCnpj = isCpfCnpj;
/** Alias de {@link isCpfCnpj}. */
export const isCnpjOrCpf = isCpfCnpj;
/** Alias de {@link isCpfCnpj}. */
export const cnpjOrCpf = isCpfCnpj;
/** Alias de {@link isCpf}. */
export const isValidCpf = isCpf;
/** Alias de {@link isCnpj}. */
export const isValidCnpj = isCnpj;
/** Alias de {@link isCpfCnpj}. */
export const isValidCpfCnpj = isCpfCnpj;
/** Alias de {@link isCpfCnpj}. */
export const isValidCpfOrCnpj = isCpfCnpj;
/** Alias de {@link isCpfCnpj}. */
export const isValidCnpjOrCpf = isCpfCnpj;
/** Alias de {@link isCpf}. */
export const validCpf = isCpf;
/** Alias de {@link isCnpj}. */
export const validCnpj = isCnpj;
/** Alias de {@link isCpfCnpj}. */
export const validCpfCnpj = isCpfCnpj;
/** Alias de {@link isCpfCnpj}. */
export const validCpfOrCnpj = isCpfCnpj;
/** Alias de {@link isCpfCnpj}. */
export const validCnpjOrCpf = isCpfCnpj;
/** Alias de {@link isCpf}. */
export const hasValidCpf = isCpf;
/** Alias de {@link isCnpj}. */
export const hasValidCnpj = isCnpj;
/** Alias de {@link isCpfCnpj}. */
export const hasValidCpfCnpj = isCpfCnpj;
/** Alias de {@link isCpfCnpj}. */
export const hasValidCpfOrCnpj = isCpfCnpj;
/** Alias de {@link isCpfCnpj}. */
export const hasValidCnpjOrCpf = isCpfCnpj;
