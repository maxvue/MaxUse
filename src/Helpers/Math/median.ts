import { toValue, type MaybeRefOrGetter } from 'vue';

/**
 * Calcula a mediana de uma lista de números.
 * A mediana é excelente para estatísticas onde existem valores discrepantes (outliers)
 * que distorceriam a média aritmética.
 * Valores não numéricos (null, undefined, strings, NaN) são ignorados no cálculo.
 *
 * @param numbers - Array de números.
 * @returns A mediana dos números, ou 0 se não houver nenhum valor numérico válido.
 */
export function median(numbers: MaybeRefOrGetter<number[] | null | undefined>): number {
    const data = toValue(numbers);
    if (!Array.isArray(data) || data.length === 0) return 0;

    const sorted = data
        .filter((n): n is number => typeof n === 'number' && !isNaN(n))
        .sort((a, b) => a - b);

    if (sorted.length === 0) return 0;

    const middle = Math.floor(sorted.length / 2);

    if (sorted.length % 2 === 0) return (sorted[middle - 1] + sorted[middle]) / 2;

    return sorted[middle];
}
