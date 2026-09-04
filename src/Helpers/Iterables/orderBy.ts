import { toValue, type MaybeRefOrGetter } from 'vue';
import { get } from '../Objects/get';
import { iteratee } from '../Utils/iteratee';

type IterateeCriterion<T> =
    | ((item: T) => unknown)
    | PropertyKey
    | [PropertyKey, unknown]
    | Record<string, any>;

export type Criterion<T> = IterateeCriterion<T>;
export type OrderDirection = 'asc' | 'desc';

/**
 * Ordena uma coleção por um ou mais critérios com direção configurável.
 * Unifica as funcionalidades de sortBy, sortByMulti e orderBy.
 * Suporta iteratees Lodash: funções, propriedades (com notação de caminho profundo),
 * objetos de correspondência (matches) e pares de propriedade/valor (matchesProperty).
 *
 * - Aceita arrays e objetos (Record → converte com Object.values).
 * - Critérios podem ser strings, funções de extração, objetos ou tuplas.
 * - Direção pode ser uma string única (aplica a todos) ou um array por critério.
 * - Valores null/undefined são empurrados para o final da lista.
 *
 * @param collection A coleção a ser ordenada (array, Record ou ref/getter de ambos).
 * @param criteria Critério(s) de ordenação: string, função, objeto matches, tupla ou array misto deles.
 * @param orders Direção: 'asc' | 'desc' (global) ou array de direções por critério. Padrão: 'asc'.
 * @returns Um novo array ordenado.
 */
export function orderBy<T>(
    collection: MaybeRefOrGetter<T[] | Record<string, T> | null | undefined>,
    criteria?: Criterion<T> | Criterion<T>[],
    orders?: OrderDirection | OrderDirection[]
): T[] {
    const data = toValue(collection);
    if (!data || typeof data !== 'object') return [];

    const items: T[] = Array.isArray(data) ? [...data] : Object.values(data);

    // Sem critério → retorna cópia sem ordenar
    if (criteria === undefined || criteria === null) return items;

    const rules = Array.isArray(criteria) ? criteria : [criteria];
    const dirs = Array.isArray(orders) ? orders : [];
    const globalDir: OrderDirection = typeof orders === 'string' ? orders : 'asc';

    const iteratees = rules.map((rule) => {
        if (typeof rule === 'function') return rule as (item: T) => unknown;
        if (typeof rule === 'string') return (item: T) => get(item, rule);
        if (typeof rule === 'object' && rule !== null) return iteratee(rule) as (item: T) => unknown;
        return (item: T) => item;
    });

    return items.sort((a, b) => {
        for (let i = 0; i < iteratees.length; i++) {
            const fn = iteratees[i];
            const dir = dirs[i] ?? globalDir;

            const valA = fn(a);
            const valB = fn(b);

            if (valA !== valB) {
                // Null/undefined vão para o final independente da direção
                if (valA === undefined) return 1;
                if (valB === undefined) return -1;
                if (valA === null) return 1;
                if (valB === null) return -1;

                const compA = valA as number | string;
                const compB = valB as number | string;

                return dir === 'asc'
                    ? (compA < compB ? -1 : 1)
                    : (compA < compB ? 1 : -1);
            }
        }
        return 0;
    });
}

export const sortBy = orderBy;
export const sortByMulti = orderBy;
