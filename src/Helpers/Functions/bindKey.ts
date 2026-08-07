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
 * Cria uma função que invoca o método `object[key]` com `object` como
 * contexto e `partials` prependados aos argumentos recebidos. Diferente
 * de `bind`, o método é **relido** de `object[key]` a cada invocação —
 * se o método for substituído em `object` depois de `bindKey` ser
 * chamado, a versão nova é usada. Aceita `placeholder`
 * (`bindKey.placeholder`) em `partials`.
 * Semelhante ao _.bindKey do Lodash.
 *
 * @param object objeto que contém o método
 * @param key nome do método em `object`
 * @param partials argumentos pré-preenchidos (podem conter `placeholder`)
 * @returns nova função que invoca `object[key]` com contexto fixado
 */
export function bindKey<T extends Record<PropertyKey, any>, K extends PropertyKey>(object: T, key: K, ...partials: unknown[]): (...args: any[]) => unknown {
    return function (this: unknown, ...args: any[]): unknown {
        const func = (object as Record<PropertyKey, unknown>)[key as PropertyKey];
        if (typeof func !== 'function') throw new TypeError('Expected a function');
        return (func as (...fnArgs: any[]) => unknown).apply(object, mergeArgs(partials, args));
    };
}

bindKey.placeholder = placeholder;
