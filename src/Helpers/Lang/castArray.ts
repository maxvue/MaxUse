import { toValue, type MaybeRefOrGetter } from 'vue';

/**
 * Transforma `value` em array se ainda não for um. Chamado sem argumentos,
 * retorna um array vazio.
 * Semelhante ao _.castArray do Lodash.
 *
 * @param value valor a transformar em array
 * @returns o próprio array, ou um array contendo `value`
 */
export function castArray<T>(value?: MaybeRefOrGetter<T>): T[] {
    if (arguments.length === 0) return [];
    const data = toValue(value as MaybeRefOrGetter<T>);
    return Array.isArray(data) ? data : [data];
}
