import { toValue, type MaybeRefOrGetter } from 'vue';

type T = Record<string, any> | any[] | null | undefined;

/**
 * Filtra uma coleção com base em uma função de callback.
 *
 * @param collection A coleção de objetos.
 * @param callback A função de callback para avaliar cada item.
 * @returns A coleção filtrada.
 */
export function filter(collection: MaybeRefOrGetter<T>, callback: (card: any) => void): T[] | Record<string, T> {
    const data = toValue(collection);

    if (!data || typeof data !== 'object') return {};

    if (Array.isArray(data)) return data.filter((item) => callback(item));

    return Object.fromEntries(Object.entries(data).filter(([, item]) => callback(item)));
}
