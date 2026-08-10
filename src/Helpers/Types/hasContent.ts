import { toValue, type MaybeRefOrGetter } from 'vue';

type RefAny = MaybeRefOrGetter<any>;

/**
 * Verifica se um valor possui algum conteúdo, não sendo vazio, nulo, indefinido ou um array/objeto sem chaves.
 *
 * @param value O valor a ser verificado.
 * @param if_zero Define se o número 0 é considerado como tendo conteúdo (padrão é false).
 * @returns Retorna verdadeiro se o valor contiver dados.
 */
export function hasContentFn(value: RefAny, if_zero: boolean = false): boolean {
    const data: any = toValue(value);

    if (!data && data !== 0) return false;

    if (typeof data === 'string') {
        const lower = data.trim().toLowerCase();
        if (lower === '' || lower === 'null' || lower === 'undefined' || lower === 'none' || lower === 'nan' || lower === 'false') return false;

        return true;
    }

    if (typeof data === 'number') return data === 0 ? if_zero : true;
    if (Array.isArray(data)) return data.length > 0;
    if (data instanceof Map || data instanceof Set) return data.size > 0;
    if (String(data) !== '[object Object]') return String(data).length > 0;
    if (typeof data === 'object') return Object.keys(data).length > 0;
    return data.length > 0;
}

/**
 * Type-guard que verifica se um valor possui conteúdo.
 * Retorna true e restringe o tipo para `NonNullable<V>` quando o valor tem dados.
 *
 * @param value - O valor a ser verificado.
 * @param if_zero - Se true, considera o número 0 como tendo conteúdo (padrão: false).
 * @returns true se o valor contiver dados (narrowing para NonNullable).
 */
export function hasContent<V>(value: V, if_zero: boolean = false): value is NonNullable<V> {
    return hasContentFn(value as any, if_zero);
}