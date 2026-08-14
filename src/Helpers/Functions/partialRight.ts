import { placeholder } from './partial';

/**
 * Combina os argumentos recebidos na chamada (`args`) com os argumentos
 * pré-preenchidos (`partials`), anexados ao final. Cada ocorrência de
 * `placeholder` em `partials` é substituída pelo próximo argumento
 * disponível de `args`; os argumentos de `args` não consumidos por um
 * placeholder são colocados **antes** de `partials`.
 *
 * @param partials argumentos pré-preenchidos, podendo conter `placeholder`
 * @param args argumentos recebidos na chamada da função combinada
 * @returns array final de argumentos
 */
function mergeArgsRight(partials: unknown[], args: unknown[]): unknown[] {
    const placeholderCount = partials.filter((p) => p === placeholder).length;
    const leadingCount = Math.max(args.length - placeholderCount, 0);
    const leading = args.slice(0, leadingCount);
    let argIndex = leadingCount;

    const merged: unknown[] = [];
    for (const value of partials) merged.push(value === placeholder ? args[argIndex++] : value);

    return [...leading, ...merged];
}

/**
 * Cria uma função que invoca `func` com `partials` anexados ao final dos
 * argumentos recebidos. Aceita `placeholder` (`partialRight.placeholder`,
 * um `Symbol` — **não** é o objeto `_`; veja `placeholder` em `partial`) em
 * qualquer posição de `partials` para reservar o lugar de um argumento a
 * ser informado na chamada da função resultante.
 * Semelhante ao _.partialRight do Lodash.
 *
 * @param func função a envolver
 * @param partials argumentos pré-preenchidos ao final (podem conter `placeholder`)
 * @returns nova função com os argumentos finais pré-preenchidos
 */
export function partialRight<T extends (...args: any[]) => any>(func: T, ...partials: unknown[]): (...args: any[]) => ReturnType<T> {
    if (typeof func !== 'function') throw new TypeError('Expected a function');

    return function (this: unknown, ...args: any[]): ReturnType<T> {
        return func.apply(this, mergeArgsRight(partials, args));
    };
}

partialRight.placeholder = placeholder;
