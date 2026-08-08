import { iteratee } from './iteratee';

/**
 * Cria uma função que itera sobre `pairs` (array de `[predicado, função]`)
 * e invoca — com `this` e os argumentos recebidos — a função do primeiro
 * par cujo predicado retornar valor verdadeiro. Cada predicado passa por
 * `iteratee`, então também aceita string (`property`), array
 * (`matchesProperty`) ou objeto (`matches`), além de função.
 * Semelhante ao _.cond do Lodash.
 *
 * @param pairs array de pares `[predicado, função]`
 * @returns função que despacha para o primeiro par cujo predicado casa
 */
export function cond(pairs: Array<[unknown, (this: unknown, ...args: unknown[]) => unknown]>): (this: unknown, ...args: unknown[]) => unknown {
    const compiled = pairs.map(([predicate, fn]) => {
        if (typeof fn !== 'function') throw new TypeError('Expected a function');
        return [iteratee(predicate), fn] as const;
    });

    return function (this: unknown, ...args: unknown[]) {
        for (const [predicate, fn] of compiled) if (predicate.apply(this, args)) return fn.apply(this, args);

        return undefined;
    };
}
