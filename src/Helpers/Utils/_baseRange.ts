/**
 * Implementação interna compartilhada por `range` e `rangeRight`. Não é
 * exportada no barrel da categoria — é um detalhe de implementação, não
 * um helper público do manifesto de migração.
 *
 * @param start início do intervalo (inclusivo)
 * @param end fim do intervalo (exclusivo)
 * @param step incremento entre cada elemento
 * @param fromRight se `true`, gera o array em ordem decrescente de índice
 * @returns array com os números do intervalo
 */
export function baseRange(start: number, end: number, step: number, fromRight: boolean): number[] {
    let index = -1;
    let length = Math.max(Math.ceil((end - start) / (step || 1)), 0);
    const result = new Array(length);

    while (length--) {
        result[fromRight ? length : ++index] = start;
        start += step;
    }
    return result;
}
