import { toValue, type MaybeRefOrGetter } from 'vue';

/**
 * Compara dois valores para determinar se são equivalentes, usando
 * `SameValueZero` (como `===`, mas trata `NaN` como igual a `NaN`).
 * Semelhante ao _.eq do Lodash.
 *
 * @param value primeiro valor
 * @param other segundo valor
 * @returns `true` se os valores forem equivalentes
 */
export function eq(value: MaybeRefOrGetter<unknown>, other: MaybeRefOrGetter<unknown>): boolean {
    const a = toValue(value);
    const b = toValue(other);
    return a === b || (a !== a && b !== b);
}
