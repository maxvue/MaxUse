import { iteratee } from './iteratee';

/**
 * Cria uma função que verifica se **todas** as funções de `iteratees` —
 * passadas por `iteratee` (aceita função, string, array `[path, srcValue]`
 * ou objeto) — retornam valor verdadeiro quando invocadas com os
 * argumentos recebidos. Array vazio sempre retorna `true`. Aceita tanto
 * argumentos variádicos (`overEvery(f1, f2)`) quanto um único array
 * (`overEvery([f1, f2])`) — os argumentos recebidos são achatados em 1
 * nível antes de virarem iteratees.
 * Semelhante ao _.overEvery do Lodash.
 *
 * @param iteratees predicados (ou valores compatíveis com `iteratee`), variádicos ou em array
 * @returns função `(...args) => boolean`
 */
export function overEvery(...iteratees: unknown[]): (this: unknown, ...args: unknown[]) => boolean {
    const fns = iteratees.flat(1).map((it) => iteratee(it));
    return function (this: unknown, ...args: unknown[]) {
        return fns.every((fn) => fn.apply(this, args));
    };
}
