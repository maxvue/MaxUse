import { toValue, type MaybeRefOrGetter } from 'vue';
import { get } from '../Objects/get';

type Criterion<T> = string | ((item: T) => unknown);
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

    return items.sort((a, b) => {
        for (let i = 0; i < rules.length; i++) {
            const rule = rules[i];
            const dir = dirs[i] ?? globalDir;

            let valA: unknown;
            let valB: unknown;

            if (typeof rule === 'function') {
                valA = rule(a);
                valB = rule(b);
            } else if (typeof rule === 'string') {
                valA = get(a, rule);
                valB = get(b, rule);
            } else {
                valA = a;
                valB = b;
            }

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
