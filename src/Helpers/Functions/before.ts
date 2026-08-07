import { toInteger } from '../Lang/toInteger';

/**
 * Cria uma função que invoca `func` até que tenha sido chamada `n - 1`
 * vezes. As chamadas seguintes retornam o resultado da última invocação de
 * `func`, sem invocá-la de novo — a função é descartada assim que o limite
 * é atingido, para permitir coleta de lixo.
 * Semelhante ao _.before do Lodash.
 *
 * @param n número de chamadas a partir do qual `func` deixa de ser invocada
 * @param func função a invocar
 * @returns nova função restrita
 */
export function before<T extends (...args: any[]) => any>(n: number, func: T): (...args: Parameters<T>) => ReturnType<T> {
    let result: ReturnType<T>;
    if (typeof func !== 'function') throw new TypeError('Expected a function');

    let count = toInteger(n);
    let target: T | undefined = func;

    return function (this: unknown, ...args: Parameters<T>): ReturnType<T> {
        if (--count > 0) result = target!.apply(this, args);
        if (count <= 1) target = undefined;
        return result;
    };
}
