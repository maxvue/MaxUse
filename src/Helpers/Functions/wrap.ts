import { partial } from './partial';

/**
 * Envolve `value` com `wrapper`, invocando `wrapper` com `value` como
 * primeiro argumento, seguido dos argumentos recebidos na chamada da
 * função resultante. Se `wrapper` não for função, ele é tratado como
 * `identity` (retorna o primeiro argumento recebido, ignorando os demais).
 * Semelhante ao _.wrap do Lodash.
 *
 * @param value valor a envolver (repassado como primeiro argumento a `wrapper`)
 * @param wrapper função que recebe `value` e os argumentos da chamada
 * @returns nova função que invoca `wrapper` com `value` prependado
 */
export function wrap<T, R>(value: T, wrapper: (value: T, ...args: any[]) => R): (...args: any[]) => R {
    const fn = typeof wrapper === 'function' ? wrapper : ((v: T) => v as unknown as R);
    return partial(fn as (...args: any[]) => R, value);
}
