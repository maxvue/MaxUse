import { iteratee } from './iteratee';

/**
 * Cria uma função que invoca cada função de `iteratees` — passada por
 * `iteratee` (aceita função, string, array `[path, srcValue]` ou objeto) —
 * com os argumentos recebidos, e retorna um array com os resultados na
 * mesma ordem. Aceita tanto argumentos variádicos (`over(f1, f2)`) quanto
 * um único array (`over([f1, f2])`) — os argumentos recebidos são
 * achatados em 1 nível antes de virarem iteratees, então ambas as formas
 * (e combinações) produzem o mesmo resultado.
 * Semelhante ao _.over do Lodash.
 *
 * @param iteratees funções (ou valores compatíveis com `iteratee`), variádicas ou em array
 * @returns função `(...args) => resultados[]`
 */
export function over(...iteratees: unknown[]): (this: unknown, ...args: unknown[]) => unknown[] {
    const fns = iteratees.flat(1).map((it) => iteratee(it));
    return function (this: unknown, ...args: unknown[]) {
        return fns.map((fn) => fn.apply(this, args));
    };
}
