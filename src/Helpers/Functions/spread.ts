import { toInteger } from '../Lang/toInteger';

/**
 * Cria uma função que invoca `func` espalhando (spread) o array recebido no
 * argumento de índice `start` como argumentos individuais. Argumentos antes
 * de `start` são repassados como estão.
 * Semelhante ao _.spread do Lodash.
 *
 * @param func função a envolver
 * @param start índice do argumento que contém o array a espalhar (padrão: `0`)
 * @returns nova função que espalha o array recebido
 */
export function spread<T extends (...args: any[]) => any>(func: T, start: number = 0): (...args: any[]) => ReturnType<T> {
    if (typeof func !== 'function') throw new TypeError('Expected a function');

    const from = Math.max(toInteger(start), 0);

    return function (this: unknown, ...args: any[]): ReturnType<T> {
        const array = args[from];
        const otherArgs = args.slice(0, from);
        // Segue o `arrayPush` interno do Lodash: só empurra elementos se
        // `array` tiver uma propriedade `.length` numérica (array ou
        // array-like) — números, booleans e objetos simples são ignorados
        // silenciosamente, mesmo sendo truthy.
        const length = array == null ? undefined : (array as { length?: unknown }).length;
        if (typeof length === 'number') for (let i = 0; i < length; i++) otherArgs.push((array as ArrayLike<unknown>)[i]);

        return func.apply(this, otherArgs);
    };
}
