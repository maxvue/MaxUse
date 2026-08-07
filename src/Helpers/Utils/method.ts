import { toValue, type MaybeRefOrGetter } from 'vue';
import { baseInvoke } from './_baseInvoke';

/**
 * Cria uma função que invoca o método no `path` do objeto que ela recebe,
 * repassando `args`. O `path` e os `args` são resolvidos uma única vez, no
 * momento da criação.
 * Semelhante ao _.method do Lodash.
 *
 * @param path caminho do método (string, array ou símbolo)
 * @param args argumentos a repassar na invocação
 * @returns função `(object) => retorno do método`
 */
export function method(path: MaybeRefOrGetter<unknown>, ...args: unknown[]): (object: unknown) => unknown {
    const key = toValue(path);
    return (object: unknown) => baseInvoke(object, key, args);
}
