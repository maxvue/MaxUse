import { toInteger } from '../Lang/toInteger';

/**
 * Implementação interna compartilhada por `ceil`, `floor` e `round`. Não é
 * exportada no barrel da categoria — é um detalhe de implementação, não um
 * helper público do manifesto de migração.
 *
 * Replica a técnica do Lodash para arredondar com precisão decimal sem os
 * erros de ponto flutuante do `Math.round(n * 10**p) / 10**p` ingênuo:
 * desloca a casa decimal manipulando a notação exponencial da string do
 * número (`"1.005e2"`) em vez de multiplicar/dividir diretamente.
 *
 * @param number número a arredondar
 * @param precision casas decimais (negativo arredonda à esquerda do ponto)
 * @param method função de arredondamento nativa (`Math.ceil`, `Math.floor` ou `Math.round`)
 * @returns número arredondado
 */
export function createRound(number: number, precision: number, method: (n: number) => number): number {
    precision = Number.isNaN(precision) ? 0 : Math.min(toInteger(precision), 292);
    if (precision && Number.isFinite(number)) {
        const pair = `${number}e`.split('e');
        const value = method(Number(`${pair[0]}e${Number(pair[1]) + precision}`));
        const pair2 = `${value}e`.split('e');
        return Number(`${pair2[0]}e${Number(pair2[1]) - precision}`);
    }
    return method(number);
}
