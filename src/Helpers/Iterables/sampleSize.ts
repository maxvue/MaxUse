import { toValue, type MaybeRefOrGetter } from 'vue';
import { toInteger } from '../Lang/toInteger';

/**
 * Obtém uma amostra aleatória de `n` elementos únicos de uma coleção
 * (array ou objeto). `n` é limitado ao tamanho da coleção.
 * Semelhante ao _.sampleSize do Lodash.
 *
 * @param collection array ou objeto de onde extrair a amostra
 * @param n quantidade de elementos a obter (padrão `1`); clampado ao tamanho
 * @returns novo array com a amostra aleatória
 */
export function sampleSize<T>(collection: MaybeRefOrGetter<T[] | Record<string, T> | null | undefined>, n?: number): T[] {
    const data = toValue(collection);
    if (!data) return [];

    const items: T[] = Array.isArray(data) ? data.slice() : (Object.values(data) as T[]);
    const length = items.length;
    if (!length) return [];

    const count = n === undefined ? 1 : toInteger(n);
    const size = Math.min(Math.max(count, 0), length);

    for (let i = 0; i < size; i++) {
        const j = i + Math.floor(Math.random() * (length - i));
        [items[i], items[j]] = [items[j], items[i]];
    }

    return items.slice(0, size);
}
