import { toValue, type MaybeRefOrGetter } from 'vue';

/**
 * Converte um valor para número seguindo a coerção interna do Lodash
 * (`toNumber`): symbols viram `NaN`, objetos usam `valueOf()`, strings são
 * aparadas antes da conversão. Não é o `toNumber` público da MaxUse (que
 * tem semântica própria de formulário/formatação) — usado só internamente
 * pelos comparadores `gt`/`gte`/`lt`/`lte`.
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

/**
 * Verifica se `value` é maior ou igual a `other`. Se ambos forem strings,
 * compara lexicograficamente; caso contrário, converte para número antes de
 * comparar.
 * Semelhante ao _.gte do Lodash.
 *
 * @param value valor a comparar
 * @param other valor de referência
 * @returns `true` se `value` for maior ou igual a `other`
 */
export function gte(value: MaybeRefOrGetter<unknown>, other: MaybeRefOrGetter<unknown>): boolean {
    let a = toValue(value);
    let b = toValue(other);
    if (!(typeof a === 'string' && typeof b === 'string')) {
        a = toComparableNumber(a);
        b = toComparableNumber(b);
    }
    return (a as number | string) >= (b as number | string);
}
