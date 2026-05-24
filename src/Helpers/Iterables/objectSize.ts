import { toValue, type MaybeRefOrGetter } from 'vue';
import { isBlank } from '../Types';

/**
 * Retorna o número de chaves próprias de um objeto.
 * Retorna 0 para valores nulos, vazios, arrays ou não-objetos.
 *
 * @param object - O objeto a ter seu tamanho calculado (aceita Ref ou Getter).
 * @returns O número de chaves do objeto, ou 0 se não for um objeto válido.
 */
export function objectSize(object: MaybeRefOrGetter<any>): number {
    const value = toValue(object);

    if (!value) return 0;

    if (isBlank(value)) return 0;

    if (Array.isArray(object)) return 0;

    if (typeof value === 'object') return Object.keys(value).length as number;

    return 0;
}

/**
 * Type-guard que verifica se um valor é um objeto válido com pelo menos uma chave.
 *
 * @param value - O valor a ser verificado.
 * @returns true se for um objeto não-vazio (objectSize > 0).
 */
export function isObjectValid<V>(value: V): value is Object & NonNullable<V> {
    return objectSize(value as any) > 0;
}