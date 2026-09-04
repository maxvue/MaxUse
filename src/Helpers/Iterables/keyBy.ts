import { toValue, type MaybeRefOrGetter } from 'vue';
import { iteratee } from '../Utils/iteratee';

export type KeyByIteratee<T> =
    | ((value: T, key: any, collection: any) => PropertyKey)
    | PropertyKey
    | [PropertyKey, unknown]
    | Record<string, any>;

/**
 * Cria um objeto composto por chaves geradas a partir dos resultados da execução
 * de cada elemento de uma coleção através de um iteratee (função, propriedade,
 * caminho profundo pontuado, matches ou matchesProperty).
 * Semelhante ao _.keyBy do Lodash.
 *
 * @param collection A coleção de objetos (array ou Record).
 * @param iterateeFn O iteratee para extrair a chave (padrão: identidade).
 * @returns Um objeto mapeado pela chave especificada.
 */
export function keyBy<T>(
    collection: MaybeRefOrGetter<Record<string, T> | T[] | null | undefined>,
    iterateeFn?: KeyByIteratee<T>
): Record<string, T> {
    const data = toValue(collection);

    if (!data || typeof data !== 'object') return {};

    const fn = iteratee(iterateeFn);
    const result: Record<string, T> = {};

    if (Array.isArray(data)) {
        for (let i = 0; i < data.length; i++) {
            const item = data[i];
            const k = fn(item, i, data);
            result[String(k)] = item;
        }
    } else {
        for (const [key, item] of Object.entries(data)) {
            const k = fn(item, key, data);
            result[String(k)] = item;
        }
    }

    return result;
}
