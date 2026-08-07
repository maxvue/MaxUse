import { before } from './before';

/**
 * Cria uma função que invoca `func` apenas uma vez. Chamadas subsequentes
 * retornam o resultado da primeira invocação.
 * Semelhante ao _.once do Lodash.
 *
 * @param func função a invocar uma única vez
 * @returns nova função restrita a uma invocação
 */
export function once<T extends (...args: any[]) => any>(func: T): (...args: Parameters<T>) => ReturnType<T> {
    return before(2, func);
}
