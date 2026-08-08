import { toValue, type MaybeRefOrGetter } from 'vue';
import { mergeWith } from './mergeWith';

function isObjectValue(value: unknown): boolean {
    const type = typeof value;
    return value != null && (type === 'object' || type === 'function');
}

/**
 * Customizer usado por `defaultsDeep`: nunca sobrescreve um valor já
 * presente em `objValue` — apenas recursa via `mergeWith` para preencher
 * chaves ausentes em profundidade, quando ambos os lados são objetos.
 * Espelha `customDefaultsMerge` do Lodash.
 */
function customDefaultsMerge(objValue: unknown, srcValue: unknown): unknown {
    if (isObjectValue(objValue) && isObjectValue(srcValue)) mergeWith(objValue as object, srcValue, customDefaultsMerge);
    return objValue;
}

/**
 * Como `defaults`, mas atribui valores padrão **recursivamente**: chaves
 * ausentes em objetos aninhados também são preenchidas, em vez de o
 * objeto aninhado inteiro ser substituído. Muta e retorna `object`.
 * Semelhante ao _.defaultsDeep do Lodash.
 *
 * @param object objeto de destino (mutado in-place)
 * @param sources objetos fonte, aplicados em ordem
 * @returns o próprio `object`
 */
export function defaultsDeep<T extends object>(object: MaybeRefOrGetter<T | null | undefined>, ...sources: Array<unknown | null | undefined>): T {
    const raw = toValue(object);
    return mergeWith(raw as T, ...sources, customDefaultsMerge);
}
