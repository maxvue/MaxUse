import { toValue, type MaybeRefOrGetter } from 'vue';
import { baseInvoke } from './_baseInvoke';

/**
 * Cria uma função que invoca o método no caminho que ela recebe,
 * consultado em `object`, repassando `args`. É o inverso de `method`: o
 * objeto é fixado na criação e o caminho varia a cada chamada.
 * Semelhante ao _.methodOf do Lodash.
 *
 * @param object objeto a consultar
 * @param args argumentos a repassar na invocação
 * @returns função `(path) => retorno do método`
 */
export function methodOf(object: MaybeRefOrGetter<unknown>, ...args: unknown[]): (path: unknown) => unknown {
    const data = toValue(object);
    return (path: unknown) => baseInvoke(data, path, args);
}
