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

    return PhoneLib.isValidPhoneNumber(String(data));
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
