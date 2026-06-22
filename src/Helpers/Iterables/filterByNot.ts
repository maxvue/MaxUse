import { toValue, type MaybeRefOrGetter } from 'vue';

type T = Record<string, any> | any[] | null | undefined;

/**
 * Filtra uma coleção removendo os elementos que possuem um determinado valor para uma chave.
 *
 * @param collection A coleção de objetos.
 * @param key A chave a ser verificada.
 * @param value O valor ou array de valores a serem excluídos (padrão é true).
 * @returns A coleção filtrada.
 */
export function filterByNot(collection: MaybeRefOrGetter<T>, key: string, value: any = true): T[] | Record<string, T> {
    const data = toValue(collection);

    if (!data || typeof data !== 'object') return [];

    const isExcluded = (item: any) => {
        const itemValue = item?.[key];
        if (Array.isArray(value)) return value.includes(itemValue);
        return itemValue === value;
    };

    if (Array.isArray(data)) return data.filter((item) => !isExcluded(item));

    return Object.fromEntries(Object.entries(data).filter(([, item]) => !isExcluded(item)));
}
