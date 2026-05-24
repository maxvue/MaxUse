import { MaybeRefOrGetter } from 'vue';
type T = Record<string, any>;
type OrderCriteria<T> = keyof T | (keyof T)[] | {
    [K in keyof T]?: 'asc' | 'desc';
};
/**
 * Ordena uma coleção de objetos com base em critérios e, em seguida, mapeia os resultados para um objeto indexado por uma chave específica.
 *
 * @param collection A coleção de objetos a ser ordenada e indexada.
 * @param criteria O(s) critério(s) de ordenação.
 * @param object_keyBy A chave a ser usada como índice do objeto retornado.
 * @param order A direção de ordenação (padrão é 'asc').
 * @returns Um objeto mapeado pela chave e ordenado de acordo com os critérios.
 */
export declare function orderByWithKey(collection: MaybeRefOrGetter<T[] | Record<string, T> | null | undefined>, criteria: OrderCriteria<T>, object_keyBy: keyof T, order?: 'asc' | 'desc'): Record<string, T>;
export {};
//# sourceMappingURL=orderByWithKey.d.ts.map