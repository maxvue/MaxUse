import { toValue, type MaybeRefOrGetter } from 'vue';
import { isFunction } from '../Lang/isFunction';
import { keys } from './keys';

/**
 * Retorna um array com os nomes das propriedades **próprias** de `object`
 * cujos valores são funções, na ordem de `keys`.
 * Semelhante ao _.functions do Lodash.
 *
 * @param object objeto a inspecionar
 * @returns array de nomes de método
 */
export function functions(object: MaybeRefOrGetter<unknown>): string[] {
    const data = toValue(object);
    if (data == null) return [];

    return keys(data).filter((key) => isFunction((data as Record<string, unknown>)[key]));
}
