import { toValue, type MaybeRefOrGetter } from 'vue';

type T = Record<string, any> | null | undefined;

/**
 * Conta o número de elementos em uma coleção que possuem um determinado valor para uma chave.
 * Preserva a funcionalidade original de `countBy` antes da harmonização com o Lodash.
 *
 * @param collection A coleção de objetos.
 * @param key A chave a ser verificada.
 * @param value O valor a ser comparado (padrão é true).
 * @returns O número de elementos correspondentes.
 */
export function countWhere(collection: MaybeRefOrGetter<T>, key: string, value: T[keyof T] | any = true): number {
    const data = toValue(collection);

    if (!data || typeof data !== 'object') return 0;

    const items = Array.isArray(data) ? data : Object.values(data);

    return items.reduce((acc, item) => acc + (item[key] === value ? 1 : 0), 0);
}
