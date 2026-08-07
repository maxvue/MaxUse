import { toValue, type MaybeRefOrGetter } from 'vue';

/**
 * Concatena arrays e/ou valores em um novo array. Não muta o array de
 * entrada; achata apenas 1 nível dos argumentos extras passados como array.
 * Semelhante ao _.concat do Lodash.
 *
 * @param array array base
 * @param values valores ou arrays adicionais a concatenar
 * @returns novo array concatenado
 */
export function concat<T>(array: MaybeRefOrGetter<T | T[]>, ...values: Array<T | T[]>): T[] {
    const data = toValue(array);
    const base: T[] = Array.isArray(data) ? data.slice() : [data];

    for (const value of values) if (Array.isArray(value)) base.push(...value);
    else base.push(value);


    return base;
}
