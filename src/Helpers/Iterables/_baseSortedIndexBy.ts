import { isSymbol } from '../Lang/isSymbol';

const MAX_ARRAY_LENGTH = 4294967295;
const MAX_ARRAY_INDEX = MAX_ARRAY_LENGTH - 1;

/**
 * Busca binária que encontra o índice de inserção de `value` em `array`
 * (previamente ordenado, pelo critério de `iterateeFn`), tratando com
 * cuidado valores não totalmente ordenáveis: `NaN`, `null`, `undefined` e
 * `Symbol` recebem posições especiais em vez de participarem da
 * comparação `<`/`<=` normal (que sempre seria `false` para eles,
 * empurrando-os incorretamente para o índice `0`).
 * Auxiliar interno compartilhado por `sortedIndexBy` e
 * `sortedLastIndexBy` — espelha `baseSortedIndexBy` do Lodash. Não é
 * exportado no barrel da categoria.
 *
 * @param array array ordenado a inspecionar
 * @param value valor a posicionar
 * @param iterateeFn função que deriva o critério de ordenação de cada elemento
 * @param retHighest se `true`, retorna o maior índice válido (comportamento de `sortedLastIndexBy`)
 * @returns índice de inserção
 */
export function baseSortedIndexBy<T>(array: T[] | null | undefined, value: T, iterateeFn: (v: T) => unknown, retHighest: boolean): number {
    let low = 0;
    let high = array == null ? 0 : array.length;
    if (high === 0) return 0;

    const target = iterateeFn(value);
    const valIsNaN = target !== target;
    const valIsNull = target === null;
    const valIsSymbol = isSymbol(target);
    const valIsUndefined = target === undefined;

    while (low < high) {
        const mid = Math.floor((low + high) / 2);
        const computed = iterateeFn((array as T[])[mid]);
        const othIsDefined = computed !== undefined;
        const othIsNull = computed === null;
        const othIsReflexive = computed === computed;
        const othIsSymbol = isSymbol(computed);

        let setLow: boolean;
        if (valIsNaN) setLow = retHighest || othIsReflexive;
        else if (valIsUndefined) setLow = othIsReflexive && (retHighest || othIsDefined);
        else if (valIsNull) setLow = othIsReflexive && othIsDefined && (retHighest || !othIsNull);
        else if (valIsSymbol) setLow = othIsReflexive && othIsDefined && !othIsNull && (retHighest || !othIsSymbol);
        else if (othIsNull || othIsSymbol) setLow = false;
        else setLow = retHighest ? (computed as number) <= (target as number) : (computed as number) < (target as number);


        if (setLow) low = mid + 1;
        else high = mid;
    }

    return Math.min(high, MAX_ARRAY_INDEX);
}
