import { MaybeRefOrGetter } from 'vue';
type Criterion<T> = string | ((item: T) => any);
type OrderDirection = 'asc' | 'desc';
/**
 * Ordena uma coleção por um ou mais critérios com direção configurável.
 * Unifica as funcionalidades de sortBy, sortByMulti e orderBy.
 *
 * - Aceita arrays e objetos (Record → converte com Object.values).
 * - Critérios podem ser strings (nome da propriedade) ou funções de extração.
 * - Direção pode ser uma string única (aplica a todos) ou um array por critério.
 * - Valores null/undefined são empurrados para o final da lista.
 *
 * @param collection A coleção a ser ordenada (array, Record ou ref/getter de ambos).
 * @param criteria Critério(s) de ordenação: string, função, ou array misto de ambos.
 * @param orders Direção: 'asc' | 'desc' (global) ou array de direções por critério. Padrão: 'asc'.
 * @returns Um novo array ordenado.
 */
export declare function orderBy<T>(collection: MaybeRefOrGetter<T[] | Record<string, T> | null | undefined>, criteria?: Criterion<T> | Criterion<T>[], orders?: OrderDirection | OrderDirection[]): T[];
export declare const sortBy: typeof orderBy;
export declare const sortByMulti: typeof orderBy;
export {};
//# sourceMappingURL=orderBy.d.ts.map