import { toValue, type MaybeRefOrGetter } from 'vue';
import { baseToString } from '../Lang/_baseToString';

/**
 * Converte um valor para número seguindo a coerção interna do Lodash
 * (`toNumber`), sem o tratamento especial de string usado em `multiply`.
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
 * Multiplica dois valores. Se ambos forem `undefined`, retorna `1`; se
 * apenas um for fornecido, retorna esse valor sem operação. Se **algum**
 * dos dois for string, ambos são convertidos via `toString` e o operador
 * `*` é aplicado diretamente (sem conversão numérica) — peculiaridade do
 * Lodash: `_.multiply('3', true)` vira `'3' * 'true'` = `NaN`.
 * Semelhante ao _.multiply do Lodash.
 *
 * @param value primeiro valor
 * @param other segundo valor
 * @returns produto dos dois valores
 */
export function multiply(value?: MaybeRefOrGetter<unknown>, other?: MaybeRefOrGetter<unknown>): number {
    const a = value === undefined ? undefined : toValue(value);
    const b = other === undefined ? undefined : toValue(other);

    if (a === undefined && b === undefined) return 1;

    let result: unknown = a;
    if (b !== undefined) {
        if (result === undefined) return b as number;
        if (typeof a === 'string' || typeof b === 'string') result = (baseToString(a) as unknown as number) * (baseToString(b) as unknown as number);
        else result = baseToNumber(a) * baseToNumber(b);

    }
    return result as number;
}
