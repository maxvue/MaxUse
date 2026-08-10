import { toValue, type MaybeRefOrGetter } from 'vue';

type T = Record<string, any> | any[] | null | undefined;

/**
 * Cria um objeto composto por chaves geradas a partir dos resultados da execução de cada elemento de uma coleção através de uma chave especificada.
 *
 * @param collection A coleção de objetos.
 * @param key A chave a ser usada como índice do novo objeto.
 * @returns Um objeto mapeado pela chave especificada.
 */
export function keyBy(collection: MaybeRefOrGetter<T | any[]>, key: string): Record<string, T> {
    const data = toValue(collection);

    if (!data || typeof data !== 'object') return {};

    const items = Array.isArray(data) ? data : Object.values(data);

    return Object.fromEntries(
        items.map((item) => [String(item[key]), item])
    );
}
