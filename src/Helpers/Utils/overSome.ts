import { iteratee } from './iteratee';

/**
 * Cria uma função que verifica se **alguma** das funções de `iteratees` —
 * passadas por `iteratee` (aceita função, string, array `[path, srcValue]`
 * ou objeto) — retorna valor verdadeiro quando invocada com os argumentos
 * recebidos. Array vazio sempre retorna `false`. Aceita tanto argumentos
 * variádicos (`overSome(f1, f2)`) quanto um único array
 * (`overSome([f1, f2])`) — os argumentos recebidos são achatados em 1
 * nível antes de virarem iteratees.
 * Semelhante ao _.overSome do Lodash.
 *
 * @param iteratees predicados (ou valores compatíveis com `iteratee`), variádicos ou em array
 * @returns função `(...args) => boolean`
 */
export function overSome(...iteratees: unknown[]): (this: unknown, ...args: unknown[]) => boolean {
    const fns = iteratees.flat(1).map((it) => iteratee(it));
    return function (this: unknown, ...args: unknown[]) {
        return fns.some((fn) => fn.apply(this, args));
    };
}
