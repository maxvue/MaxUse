import { toValue, type MaybeRefOrGetter } from 'vue';
import { iteratee } from '../Utils/iteratee';

/**
 * Cria um objeto composto por chaves geradas a partir dos resultados da execução
 * de cada elemento da coleção através do iteratee. O valor correspondente de cada
 * chave é o número de vezes que essa chave foi retornada pelo iteratee.
 * Semelhante ao _.countBy do Lodash.
 *
 * @param collection A coleção para iterar.
 * @param iterateeFn O iteratee para transformar as chaves.
 * @returns Retorna o objeto com a contagem agrupada.
 */
export function countBy<T>(
    collection: MaybeRefOrGetter<T[] | Record<string, T> | null | undefined>,
    iterateeFn?: unknown
): Record<string, number> {
    const data = toValue(collection);

    if (data == null || typeof data !== 'object') return {};

    const items = Array.isArray(data) ? data : Object.values(data);
    const fn = iteratee(iterateeFn) as (value: T) => unknown;
    const result: Record<string, number> = {};

    for (const item of items) {
        const key = String(fn(item));
        result[key] = (result[key] ?? 0) + 1;
    }

    return result;
}

