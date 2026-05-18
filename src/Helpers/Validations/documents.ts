import { validateBr } from 'js-brasil';
import { type MaybeRefOrGetter, toValue } from 'vue';

type RefString = MaybeRefOrGetter<string | number | null | undefined>;

/**
 * Valida se uma string é um CPF válido.
 */
export function isCpf(value: RefString) {
    const data = toValue(value);
    return validateBr.cpf(data);
}

/**
 * Valida se uma string é um CNPJ válido.
 */
export function isCnpj(value: RefString) {
    const data = toValue(value);
    return validateBr.cnpj(data);
}

/**
 * Valida se uma string é um CPF ou CNPJ válido.
 */
export function isCpfCnpj(value: RefString) {
    const data = toValue(value);
    return validateBr.cpfcnpj(data);
}

export const cpf = isCpf;
export const cnpj = isCnpj;
export const cpfcnpj = isCpfCnpj;
export const cpfIsValid = isCpf;
export const cnpjIsValid = isCnpj;
export const cpfCnpjIsValid = isCpfCnpj;
export const isCpfOrCnpj = isCpfCnpj;
export const cpfOrCnpj = isCpfCnpj;
export const isCnpjOrCpf = isCpfCnpj;
export const cnpjOrCpf = isCpfCnpj;
export const isValidCpf = isCpf;
export const isValidCnpj = isCnpj;
export const isValidCpfCnpj = isCpfCnpj;
export const isValidCpfOrCnpj = isCpfCnpj;
export const isValidCnpjOrCpf = isCpfCnpj;
export const validCpf = isCpf;
export const validCnpj = isCnpj;
export const validCpfCnpj = isCpfCnpj;
export const validCpfOrCnpj = isCpfCnpj;
export const validCnpjOrCpf = isCpfCnpj;
export const hasValidCpf = isCpf;
export const hasValidCnpj = isCnpj;
export const hasValidCpfCnpj = isCpfCnpj;
export const hasValidCpfOrCnpj = isCpfCnpj;
export const hasValidCnpjOrCpf = isCpfCnpj;
