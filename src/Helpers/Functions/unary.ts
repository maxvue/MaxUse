import { ary } from './ary';

/**
 * Cria uma função que invoca `func` com no máximo um argumento,
 * descartando os demais. Útil para evitar que argumentos extras de
 * callbacks nativos (índice, array) sejam repassados por engano.
 * Semelhante ao _.unary do Lodash.
 *
 * @param func função a envolver
 * @returns nova função que aceita apenas um argumento
 */
export function unary<T extends (...args: any[]) => any>(func: T): (arg: Parameters<T>[0]) => ReturnType<T> {
    return ary(func, 1);
}
