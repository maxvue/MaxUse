import { isSymbol } from '../Lang/isSymbol';

/**
 * Percorre `array` aplicando `iterateeFn` a cada elemento e mantém o
 * elemento cujo valor derivado "vence" segundo `comparator` (`>` para
 * `max`/`maxBy`, `<` para `min`/`minBy`). Valores `null`/`undefined` e
 * `Symbol` são ignorados na comparação (nunca vencem).
 * Auxiliar interno compartilhado por `max`, `min`, `maxBy` e `minBy` —
 * espelha `baseExtremum` do Lodash. Não é exportado no barrel da
 * categoria.
 *
 * @param array array a percorrer
 * @param iterateeFn função que deriva o valor comparável de cada elemento
 * @param comparator `(atual, melhorAtéAgora) => boolean` — `true` promove `atual`
 * @returns o elemento vencedor, ou `undefined` se nenhum for comparável
 */
export function baseExtremum<T>(array: T[], iterateeFn: (value: T) => unknown, comparator: (a: unknown, b: unknown) => boolean): T | undefined {
    let computed: unknown;
    let result: T | undefined;

    for (const value of array) {
        const current = iterateeFn(value);
        if (current != null && (computed === undefined ? (current === current && !isSymbol(current)) : comparator(current, computed))) {
            computed = current;
            result = value;
        }
    }

    return result;
}
