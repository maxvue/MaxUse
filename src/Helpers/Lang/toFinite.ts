import { toValue, type MaybeRefOrGetter } from 'vue';

const MAX_INTEGER = 1.7976931348623157e+308;

/**
 * Converte um valor para um número finito. `Infinity`/`-Infinity` são
 * grampeados em `Number.MAX_VALUE`/`-Number.MAX_VALUE`; `NaN` vira `0`.
 * Semelhante ao _.toFinite do Lodash.
 *
 * @param value valor a converter
 * @returns número finito resultante
 */
export function toFinite(value: MaybeRefOrGetter<unknown>): number {
    const data = toValue(value);
    if (!data) return data === 0 ? (data as number) : 0;

    let num = toComparableNumber(data);
    if (num === Infinity || num === -Infinity) {
        const sign = num < 0 ? -1 : 1;
        return sign * MAX_INTEGER;
    }
    return num === num ? num : 0;
}

/**
 * Coerção numérica interna, seguindo o `toNumber` do Lodash.
 *
 * @param value valor a converter
 * @returns número resultante da coerção
 */
function toComparableNumber(value: unknown): number {
    if (typeof value === 'number') return value;
    if (typeof value === 'symbol') return NaN;
    if (value !== null && typeof value === 'object') {
        const other = typeof (value as { valueOf?: () => unknown }).valueOf === 'function' ? (value as { valueOf: () => unknown }).valueOf() : value;
        value = (other !== null && typeof other === 'object') ? `${other}` : other;
    }
    if (typeof value !== 'string') return value === 0 ? (value as number) : +(value as number);
    return +value.trim();
}
