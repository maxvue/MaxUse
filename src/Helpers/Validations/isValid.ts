import { size } from '../Iterables';

/**
 * Verifica se um valor NÃO está vazio (tem tamanho > 0).
 * Usa {@link size} internamente para calcular o tamanho.
 *
 * @param value - O valor a ser verificado.
 * @returns true se o valor tiver conteúdo (size > 0).
 */
export function notEmpty<V>(value: V): value is NonNullable<V> {
    if (typeof value === 'boolean' || typeof value === 'number') return true;
    return size(value as any) > 0;
}

/**
 * Verifica se um valor NÃO está vazio (tem tamanho > 0).
 * Alias semântico de {@link notEmpty}.
 *
 * @param value - O valor a ser verificado.
 * @returns true se o valor tiver conteúdo (size > 0).
 */
export function isNotEmpty<V>(value: V): value is NonNullable<V> {
    if (typeof value === 'boolean' || typeof value === 'number') return true;
    return size(value as any) > 0;
}

/**
 * Verifica se um valor NÃO está vazio.
 * Alias de {@link notEmpty}.
 *
 * @param value - O valor a ser verificado.
 * @returns true se o valor tiver conteúdo (size > 0).
 */
export function noEmpty<V>(value: V): value is NonNullable<V> {
    if (typeof value === 'boolean' || typeof value === 'number') return true;
    return size(value as any) > 0;
}

/**
 * Verifica se um valor está vazio (tamanho === 0).
 * Inverso de {@link notEmpty}.
 *
 * @param value - O valor a ser verificado.
 * @returns true se o valor estiver vazio (size === 0).
 */
export function isEmpty<V>(value: V): value is NonNullable<V> {
    if (typeof value === 'boolean' || typeof value === 'number') return false;
    return size(value as any) === 0;
}

/**
 * Verifica se um valor está vazio (tamanho === 0).
 * Alias simplificado de {@link isEmpty}.
 *
 * @param value - O valor a ser verificado.
 * @returns true se o valor estiver vazio (size === 0).
 */
export function empty<V>(value: V): boolean {
    if (typeof value === 'boolean' || typeof value === 'number') return false;
    return size(value as any) === 0;
}

/**
 * Verifica se um valor é válido (não é null e não é undefined).
 *
 * @param value - O valor a ser verificado.
 * @returns true se o valor não for null nem undefined.
 */
export function isValid<V>(value: V): value is NonNullable<V> {
    return value !== null && value !== undefined;
}

/**
 * Verifica se um valor NÃO é válido (é null ou undefined).
 * Inverso de {@link isValid}.
 *
 * @param value - O valor a ser verificado.
 * @returns true se o valor for null ou undefined.
 */
export function isNotValid<V>(value: V): value is Extract<V, null | undefined> {
    return !isValid(value);
}

/**
 * Verifica se um valor NÃO tem conteúdo válido (é null ou undefined).
 * Alias de {@link isNotValid}.
 *
 * @param value - O valor a ser verificado.
 * @returns true se o valor for null ou undefined.
 */
export function notHasValidContent<V>(value: V): value is Extract<V, null | undefined> {
    return !isValid(value);
}

