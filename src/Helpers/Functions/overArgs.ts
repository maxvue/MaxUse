import { iteratee } from '../Utils/iteratee';

/**
 * Cria uma função que invoca `func` com seus argumentos transformados,
 * cada um pela função "iteratee" correspondente em `transforms` (na mesma
 * posição). Cada item de `transforms` passa por `iteratee()`, então
 * também aceita atalhos (string de propriedade, objeto `matches`, etc.).
 * Argumentos sem transform correspondente são repassados sem alteração.
 * Semelhante ao _.overArgs do Lodash.
 *
 * @param func função a invocar com os argumentos transformados
 * @param transforms funções (ou atalhos de iteratee) aplicadas a cada argumento
 * @returns nova função que transforma os argumentos antes de invocar `func`
 */
export function overArgs<T extends (...args: any[]) => any>(func: T, ...transforms: unknown[]): (...args: any[]) => ReturnType<T> {
    if (typeof func !== 'function') throw new TypeError('Expected a function');

    const flat = transforms.length === 1 && Array.isArray(transforms[0]) ? transforms[0] : transforms.flat();
    const funcs = flat.map((t) => iteratee(t as any));
    const funcsLength = funcs.length;

    return function (this: unknown, ...args: any[]): ReturnType<T> {
        const length = Math.min(args.length, funcsLength);
        const transformed = args.slice();
        for (let index = 0; index < length; index++) transformed[index] = funcs[index].call(this, args[index]);

        return func.apply(this, transformed);
    };
}
