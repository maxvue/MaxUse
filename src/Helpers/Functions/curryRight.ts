import { toInteger } from '../Lang/toInteger';
import { placeholder } from './partial';

/**
 * Conta quantas ocorrências de `placeholder` existem em `args`.
 *
 * @param args argumentos a inspecionar
 * @returns número de placeholders encontrados
 */
function countHolders(args: unknown[]): number {
    let count = 0;
    for (const value of args) if (value === placeholder) count++;
    return count;
}

/**
 * Extrai os índices de `array` que contêm `placeholder`.
 *
 * @param array array a inspecionar
 * @returns índices onde `placeholder` aparece
 */
function replaceHolders(array: unknown[]): number[] {
    const result: number[] = [];
    for (let index = 0; index < array.length; index++) if (array[index] === placeholder) result.push(index);

    return result;
}

/**
 * Compõe `args` (argumentos recebidos na chamada atual) com `partials`
 * (argumentos já acumulados à direita), respeitando `holders` — os
 * índices de `partials` que ainda são `placeholder` e devem ser
 * preenchidos, na ordem, pelos itens finais de `args`. Espelha o
 * `composeArgsRight` interno do Lodash.
 *
 * @param args argumentos da chamada atual
 * @param partials argumentos acumulados à direita (podem conter `placeholder`)
 * @param holders índices de `partials` que são `placeholder`
 * @returns array combinado de argumentos
 */
function composeArgsRight(args: unknown[], partials: unknown[], holders: number[]): unknown[] {
    const argsLength = args.length;
    const holdersLength = holders.length;
    const rangeLength = Math.max(argsLength - holdersLength, 0);

    const result: unknown[] = new Array(rangeLength + partials.length);
    for (let i = 0; i < rangeLength; i++) result[i] = args[i];

    const offset = rangeLength;
    for (let i = 0; i < partials.length; i++) result[offset + i] = partials[i];

    let argsIndex = rangeLength;
    for (let i = 0; i < holdersLength; i++) if (argsIndex < argsLength) result[offset + holders[i]] = args[argsIndex++];

    return result;
}

/**
 * Cria uma função "curried" que acumula os argumentos pela direita: cada
 * novo grupo de argumentos é posicionado antes dos argumentos já
 * acumulados. Aceita `placeholder` (`curryRight.placeholder`) para
 * reservar posições, inclusive em chamadas sucessivas que preenchem os
 * mesmos placeholders aos poucos. Semelhante ao `curry`, mas espelhado.
 * Semelhante ao _.curryRight do Lodash.
 *
 * @param func função a curried
 * @param arity número de argumentos esperados (padrão: `func.length`)
 * @returns função curried pela direita
 */
export function curryRight<T extends (...args: any[]) => any>(func: T, arity: number = func.length): (...args: any[]) => any {
    if (typeof func !== 'function') throw new TypeError('Expected a function');

    const totalArity = toInteger(arity);

    function step(partials: unknown[], holders: number[], remaining: number): (...args: any[]) => any {
        const fn = function (this: unknown, ...incoming: unknown[]): any {
            const holdersCount = countHolders(incoming);
            const composed = composeArgsRight(incoming, partials, holders);
            const length = incoming.length - holdersCount;

            if (length < remaining) {
                const newHolders = replaceHolders(composed);
                return step(composed, newHolders, remaining - length);
            }
            return func.apply(this, composed);
        };

        Object.defineProperty(fn, 'length', {
            value: Math.max(remaining, 0),
            writable: false,
            enumerable: false,
            configurable: true
        });

        (fn as any).placeholder = placeholder;
        return fn;
    }

    const curried = step([], [], totalArity);
    return curried;
}

curryRight.placeholder = placeholder;
