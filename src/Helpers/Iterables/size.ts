import { toValue, type MaybeRefOrGetter } from 'vue';
import { isBlank } from '../Types';

type T = Record<string, any> | string | number | null | undefined;

/**
 * Retorna o tamanho (comprimento) de uma coleção, string, objeto, Map ou Set.
 *
 * @param value O valor a ter seu tamanho calculado.
 * @param allow_number Se verdadeiro, retorna o próprio valor numérico caso o tipo seja número (padrão é true).
 * @returns O tamanho do valor especificado.
 */
export function size(value: MaybeRefOrGetter<T>, allow_number: boolean = true): number {
    if (!value) return 0;

    const data: any = toValue(value);

    if (!data) return 0;

    if (isBlank(data, false)) return 0;

    if (typeof data === 'number' && allow_number) return data;

    if (Array.isArray(data) || typeof data === 'string') return data.length;

    if (data instanceof Map || data instanceof Set) return data.size;

    if (typeof data === 'object') return Object.keys(data).length;

    return data.length;
}

