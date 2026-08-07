import { toValue, type MaybeRefOrGetter } from 'vue';
import { baseSet } from './_baseSet';

/**
 * Como `set`, mas aceita `customizer` para produzir as estruturas
 * intermediárias criadas ao longo do `path`. Se `customizer` retornar
 * `undefined`, a criação de caminho cai no comportamento padrão. Um uso
 * comum é passar o construtor `Object` para forçar objetos planos mesmo
 * em segmentos que pareceriam índices de array.
 * Semelhante ao _.setWith do Lodash.
 *
 * @param object objeto a modificar (mutado in-place)
 * @param path caminho da propriedade a definir
 * @param value valor a atribuir
 * @param customizer função opcional `(nsValue, key, nsObject) => estrutura`
 * @returns o próprio `object`
 */
export function setWith<T>(
    object: MaybeRefOrGetter<T | null | undefined>,
    path: MaybeRefOrGetter<unknown>,
    value: unknown,
    customizer?: (nsValue: unknown, key: PropertyKey, nsObject: unknown) => unknown
): T | null | undefined {
    const data = toValue(object);
    if (data == null) return data;
    return baseSet(data, toValue(path), value, customizer);
}
