import { toValue, type MaybeRefOrGetter } from 'vue';

/**
 * Calcula a média aritmética de um array de números.
 * Valores não numéricos (null, undefined, strings, NaN) são ignorados no cálculo.
 *
 * @param numbers - Array de números.
 * @returns A média aritmética, ou 0 se não houver nenhum valor numérico válido.
 */
export function average(numbers: MaybeRefOrGetter<number[] | null | undefined>): number {
    const data = toValue(numbers);
    if (!Array.isArray(data) || data.length === 0) return 0;

    const valid = data.filter((n): n is number => typeof n === 'number' && !isNaN(n));
    if (valid.length === 0) return 0;

    const sum = valid.reduce((acc, val) => acc + val, 0);
    return sum / valid.length;
}
