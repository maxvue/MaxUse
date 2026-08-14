import { toValue, type MaybeRefOrGetter } from 'vue';

type T = Record<string, any> | any[] | null | undefined;

/**
 * Filtra uma coleção com base em uma função de callback.
 *
 * Entradas `null`/`undefined` ou primitivas devolvem um array vazio,
 * seguindo o contrato do `_.filter` do Lodash. Para um Record, a MaxUse
 * mantém a extensão de devolver um Record com as chaves preservadas.
 *
 * @param collection A coleção de objetos.
 * @param callback A função de callback para avaliar cada item.
 * @returns A coleção filtrada.
 */
export function filter(collection: MaybeRefOrGetter<T>, callback: (card: any) => void): T[] | Record<string, T> {
    const data = toValue(collection);

    if (data == null) return [];

    if (typeof data !== 'object') return [];

    if (Array.isArray(data)) return data.filter((item) => callback(item));

    return Object.fromEntries(Object.entries(data).filter(([, item]) => callback(item)));
}
