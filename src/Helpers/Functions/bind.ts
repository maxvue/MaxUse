import { placeholder } from './partial';

/**
 * Combina os argumentos pré-preenchidos (`partials`) com os argumentos
 * recebidos na chamada (`args`), substituindo cada ocorrência do
 * `placeholder` em `partials` pelo próximo argumento disponível de `args`.
 *
 * @param partials argumentos pré-preenchidos, podendo conter `placeholder`
 * @param args argumentos recebidos na chamada da função combinada
 * @returns array final de argumentos
 */
function mergeArgs(partials: unknown[], args: unknown[]): unknown[] {
    const result: unknown[] = [];
    let argIndex = 0;
    for (const value of partials) result.push(value === placeholder ? args[argIndex++] : value);

    while (argIndex < args.length) result.push(args[argIndex++]);
    return result;
}

/**
 * Cria uma função que invoca `func` com `thisArg` fixado como contexto e
 * `partials` prependados aos argumentos recebidos. Aceita `placeholder`
 * (`bind.placeholder`, igual ao `partial.placeholder`) em qualquer
 * posição de `partials`. Assim como o `bind` nativo, uma vez fixado, o
 * contexto não pode ser trocado por um `bind` subsequente.
 * Semelhante ao _.bind do Lodash.
 *
 * @param func função a envolver
 * @param thisArg contexto (`this`) a fixar na invocação
 * @param partials argumentos pré-preenchidos (podem conter `placeholder`)
 * @returns nova função com contexto e argumentos iniciais fixados
 */
export function bind<T extends (...args: any[]) => any>(func: T, thisArg: unknown, ...partials: unknown[]): (...args: any[]) => ReturnType<T> {
    if (typeof func !== 'function') throw new TypeError('Expected a function');

    return function (this: unknown, ...args: any[]): ReturnType<T> {
        return func.apply(thisArg, mergeArgs(partials, args));
    };
}

bind.placeholder = placeholder;
