import { toValue, type MaybeRefOrGetter } from 'vue';

/**
 * Converte um valor para número seguindo a coerção interna do Lodash
 * (`toNumber`), sem o tratamento especial de string.
 *
 * @param value valor a converter
 * @returns número resultante da coerção
 */
function baseToNumber(value: unknown): number {
    if (typeof value === 'number') return value;
    if (typeof value === 'symbol') return NaN;
    return +(value as number);
}

/**
 * Subtrai `other` de `value`. Se ambos forem `undefined`, retorna `0`; se
 * apenas um for fornecido, retorna esse valor sem operação. Se algum dos
 * dois for string, concatena em vez de subtrair numericamente.
 * Semelhante ao _.subtract do Lodash.
 *
 * @param value valor de origem
 * @param other valor a subtrair
 * @returns diferença (ou concatenação) dos dois valores
 */
export function subtract(value?: MaybeRefOrGetter<unknown>, other?: MaybeRefOrGetter<unknown>): number | string {
    const a = value === undefined ? undefined : toValue(value);
    const b = other === undefined ? undefined : toValue(other);

    if (a === undefined && b === undefined) return 0;

    let result: unknown = a;
    if (b !== undefined) {
        if (result === undefined) return b as number | string;
        if (typeof a === 'string' || typeof b === 'string') result = (`${a}` as unknown as number) - (`${b}` as unknown as number);
        else result = baseToNumber(a) - baseToNumber(b);

    }
    return result as number | string;
}
