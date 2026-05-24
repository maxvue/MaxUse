import { hasContentFn } from './hasContent';

/**
 * Verifica se um valor está "em branco".
 *
 * @param value O valor a ser verificado.
 * @param if_zero Se true, considera o número 0 como NÃO estando em branco.
 * @returns Retorna true se estiver em branco.
 */

export function isBlank<V>(value: V, if_zero: boolean = false): boolean {
    return ! hasContentFn(value as any, if_zero);
}

/**
 * Alias de {@link isBlank}. Verifica se um valor está em branco.
 *
 * @param value - O valor a ser verificado.
 * @param if_zero - Se true, considera o número 0 como NÃO estando em branco.
 * @returns true se estiver em branco.
 */
export function blank<V>(value: V, if_zero: boolean = false): boolean {
    return ! hasContentFn(value as any, if_zero);
}