import { isError } from '../Lang/isError';

/**
 * Invoca `func` com os `args` fornecidos, protegido por try/catch. Se
 * `func` lançar, o erro é retornado (em vez de propagado) — envolvido em
 * `Error` caso o valor lançado não seja já um objeto de erro.
 * Semelhante ao _.attempt do Lodash.
 *
 * @param func função a invocar
 * @param args argumentos a repassar na chamada
 * @returns o retorno de `func`, ou o erro capturado
 */
export function attempt<A extends unknown[], R>(func: (...args: A) => R, ...args: A): R | Error {
    try {
        return func(...args);
    } catch (e) {
        return isError(e) ? (e as Error) : new Error(e as string);
    }
}
