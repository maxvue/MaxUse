import { toValue, type MaybeRefOrGetter } from 'vue';

/**
 * Retorna `value` se não for `null`, `undefined` nem `NaN`; caso
 * contrário, retorna `defaultValue`.
 * Semelhante ao _.defaultTo do Lodash.
 *
 * @param value valor a verificar
 * @param defaultValue valor substituto usado quando `value` é `null`/`undefined`/`NaN`
 * @returns `value` ou `defaultValue`
 */
export function defaultTo<T, D>(value: MaybeRefOrGetter<T>, defaultValue: MaybeRefOrGetter<D>): T | D {
    const data = toValue(value);
    if (data === null || data === undefined || data !== data) return toValue(defaultValue);
    return data;
}
