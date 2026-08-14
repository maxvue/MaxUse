/**
 * Símbolo usado como placeholder para "pular" a posição de um argumento
 * pré-preenchido em `partial`, `partialRight` e `bind` — o valor real é
 * preenchido na chamada da função resultante.
 * Semelhante ao `_.partial.placeholder` do Lodash.
 *
 * **Atenção — diferença em relação ao Lodash:** aqui o placeholder é um
 * `Symbol` dedicado e **não** é o objeto `_`. No Lodash `_` é a própria
 * função da biblioteca, o que permite usá-lo como sentinela; na MaxUse `_`
 * é apenas um objeto agregador de helpers. Passar `_` em posição de
 * placeholder **não** gera erro: ele é tratado como um argumento real.
 * Importe `placeholder` nominalmente. O mesmo símbolo é reexportado como
 * `partial.placeholder`, `partialRight.placeholder`, `curry.placeholder`,
 * `curryRight.placeholder`, `bind.placeholder` e `bindKey.placeholder`.
 *
 * @example
 * import { partial, placeholder } from '@maxvue/max-use';
 *
 * const greet = (greeting: string, name: string) => `${greeting} ${name}`;
 * const greetFred = partial(greet, placeholder, 'fred');
 * greetFred('hi'); // 'hi fred'
 */
export const placeholder: unique symbol = Symbol('maxuse.partial.placeholder');

/**
 * Combina os argumentos pré-preenchidos (`partials`) com os argumentos
 * recebidos na chamada (`args`), substituindo cada ocorrência do
 * `placeholder` em `partials` pelo próximo argumento disponível de `args`.
 * Argumentos de `args` não consumidos por um placeholder são anexados ao
 * final.
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
 * Cria uma função que invoca `func` com `partials` prependados aos
 * argumentos recebidos. Aceita `placeholder` (`partial.placeholder`) em
 * qualquer posição de `partials` para reservar o lugar de um argumento a
 * ser informado na chamada da função resultante.
 * Semelhante ao _.partial do Lodash.
 *
 * @param func função a envolver
 * @param partials argumentos pré-preenchidos (podem conter `placeholder`)
 * @returns nova função com os argumentos iniciais pré-preenchidos
 */
export function partial<T extends (...args: any[]) => any>(func: T, ...partials: unknown[]): (...args: any[]) => ReturnType<T> {
    if (typeof func !== 'function') throw new TypeError('Expected a function');

    return function (this: unknown, ...args: any[]): ReturnType<T> {
        return func.apply(this, mergeArgs(partials, args));
    };
}

partial.placeholder = placeholder;
