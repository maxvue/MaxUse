import { toValue, type MaybeRefOrGetter } from 'vue';

/**
 * Converte um valor em um objeto simples, copiando as propriedades
 * enumeráveis próprias **e** herdadas (equivalente a um `for...in`).
 * Semelhante ao _.toPlainObject do Lodash.
 *
 * @param value valor a converter
 * @returns objeto simples com as propriedades copiadas
 */
export function toPlainObject(value: MaybeRefOrGetter<unknown>): Record<string, unknown> {
    const data = toValue(value);
    const result: Record<string, unknown> = {};
    if (data === null || data === undefined) return result;

    for (const key in data as object) result[key] = (data as Record<string, unknown>)[key];
    return result;
}
