import { toValue, type MaybeRefOrGetter } from 'vue';
import { baseGet } from '../Utils/_baseGet';
import { baseSet } from './_baseSet';

/**
 * Como `set`, mas aceita `updater` para produzir o valor a definir, a
 * partir do valor atual no `path` (`updater(currentValue)`).
 * Semelhante ao _.update do Lodash.
 *
 * @param object objeto a modificar (mutado in-place)
 * @param path caminho da propriedade a atualizar
 * @param updater função que recebe o valor atual e retorna o novo valor
 * @returns o próprio `object`
 */
export function update<T>(object: MaybeRefOrGetter<T | null | undefined>, path: MaybeRefOrGetter<unknown>, updater: (currentValue: unknown) => unknown): T | null | undefined {
    const data = toValue(object);
    if (data == null) return data;
    const key = toValue(path);
    return baseSet(data, key, updater(baseGet(data, key)));
}
