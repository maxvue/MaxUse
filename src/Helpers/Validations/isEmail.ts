import { type MaybeRefOrGetter, toValue } from 'vue';

/**
 * Valida se uma string é um endereço de e-mail com formato válido.
 *
 * @param value O valor a ser validado (string, Ref ou Getter).
 * @returns True se for um e-mail válido, false caso contrário.
 */
export function isEmail(value: MaybeRefOrGetter<string | null | undefined>): boolean {
    const data = toValue(value);

    if (!data || typeof data !== 'string') return false;

    // Limite prático de comprimento (RFC 5321)
    if (data.length > 254) return false;

    // Parte local: grupos alfanuméricos separados por ponto único (sem ponto no início/fim).
    // Domínio: labels que não iniciam nem terminam com hífen, seguidas de TLD com 2+ letras.
    const emailRegex = /^[a-zA-Z0-9_%+-]+(\.[a-zA-Z0-9_%+-]+)*@([a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;

    return emailRegex.test(data);
}

export const email = isEmail;
export const emailIsValid = isEmail;
export const isValidEmail = isEmail;
export const hasValidEmail = isEmail;
export const validEmail = isEmail;
export const hasEmail = isEmail;
export const isEMail = isEmail;
export const eMail = isEmail;
export const eMailIsValid = isEmail;
export const isValidEMail = isEmail;
export const hasValidEMail = isEmail;
export const validEMail = isEmail;
export const hasEMail = isEmail;
