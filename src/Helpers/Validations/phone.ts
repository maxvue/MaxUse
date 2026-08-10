import * as PhoneLib from 'libphonenumber-js';
import { type MaybeRefOrGetter, toValue } from 'vue';

/**
 * Valida se uma string é um número de telefone válido (padrão internacional via libphonenumber-js).
 *
 * @param value - O número de telefone a ser validado (aceita Ref ou Getter).
 * @returns true se for um número de telefone válido, false caso contrário.
 */
export function phone(value: MaybeRefOrGetter<string | number | null | undefined>): boolean {
    const data = toValue(value);
    if (!data) return false;

    const str = String(data);
    const digitsOnly = str.replace(/\D/g, '');

    const without55 = digitsOnly.startsWith('55') && digitsOnly.length > 11 ? digitsOnly.slice(2) : digitsOnly;
    if (without55.length < 10) return false;
    if (without55.startsWith('00')) return false;

    return PhoneLib.isValidPhoneNumber(str, { defaultCountry: 'BR', defaultCallingCode: '55' });
}

/** Alias de {@link phone}. */
export const isValidPhone = phone;
/** Alias de {@link phone}. */
export const isPhoneValid = phone;
/** Alias de {@link phone}. */
export const hasValidPhone = phone;
/** Alias de {@link phone}. */
export const validPhone = phone;
/** Alias de {@link phone}. */
export const isPhone = phone;
/** Alias de {@link phone}. */
export const hasPhone = phone;
/** Alias de {@link phone}. */
export const phoneIsValid = phone;
