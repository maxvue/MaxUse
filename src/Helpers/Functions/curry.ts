import { toInteger } from '../Lang/toInteger';
import { placeholder } from './partial';

/**
 * Verifica se `args` contém argumentos reais suficientes para completar a
 * aridade `arity` — placeholders não contam como argumento preenchido.
 *
 * @param args argumentos acumulados até agora
 * @param arity número de argumentos necessários
 * @returns `true` se `args` tem `arity` posições preenchidas (sem placeholder)
 */
function hasEnoughArgs(args: unknown[], arity: number): boolean {
    if (args.length < arity) return false;
    for (let i = 0; i < arity; i++) if (args[i] === placeholder) return false;

    return true;
}

/**
 * Combina os argumentos já acumulados com os novos, substituindo
 * `placeholder` pelos novos argumentos, na ordem em que aparecem.
 *
 * @param existing argumentos já acumulados (podem conter `placeholder`)
 * @param incoming novos argumentos recebidos na chamada atual
 * @returns array combinado de argumentos
 */
function mergeCurryArgs(existing: unknown[], incoming: unknown[]): unknown[] {
    const result = existing.slice();
    let incomingIndex = 0;
    for (let i = 0; i < result.length && incomingIndex < incoming.length; i++) if (result[i] === placeholder) result[i] = incoming[incomingIndex++];

    while (incomingIndex < incoming.length) result.push(incoming[incomingIndex++]);
    return result;
}

function createCurried(func: Function, arity: number, accumulatedArgs: unknown[] = []): any {
    const fn = function (this: unknown, ...args: unknown[]): any {
        const combined = mergeCurryArgs(accumulatedArgs, args);
        if (hasEnoughArgs(combined, arity)) return func.apply(this, combined.slice(0, Math.max(combined.length, arity)));

        return createCurried(func, arity, combined);
    };

    let nonPlaceholdersCount = 0;
    for (let i = 0; i < accumulatedArgs.length && i < arity; i++) if (accumulatedArgs[i] !== placeholder) nonPlaceholdersCount++;

    const remainingArity = Math.max(arity - nonPlaceholdersCount, 0);

    Object.defineProperty(fn, 'length', {
        value: remainingArity,
        writable: false,
        enumerable: false,
        configurable: true
    });

    fn.placeholder = placeholder;
    return fn;
}

/**
 * Cria uma função "curried": pode ser invocada com menos argumentos do
 * que `func` espera, retornando uma nova função que aceita o restante.
 * Aceita `placeholder` (`curry.placeholder`, igual ao de `partial`) para
 * reservar posições a preencher em chamadas futuras.
 * Semelhante ao _.curry do Lodash.
 *
 * @param func função a curried
 * @param arity número de argumentos esperados (padrão: `func.length`)
 * @returns função curried
 */
export function curry<T extends (...args: any[]) => any>(func: T, arity: number = func.length): (...args: any[]) => any {
    if (typeof func !== 'function') throw new TypeError('Expected a function');

    const n = toInteger(arity);
    return createCurried(func, n, []);
}

curry.placeholder = placeholder;
