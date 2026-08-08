import { toValue, type MaybeRefOrGetter } from 'vue';
import { baseInvoke } from '../Utils/_baseInvoke';

/**
 * Invoca o método no `path` de cada elemento de `collection`, repassando
 * `args`, e retorna um array com os resultados. `path` também aceita uma
 * função — nesse caso ela é invocada diretamente com `this` ligado ao
 * elemento, em vez de resolvida por caminho.
 * Semelhante ao _.invokeMap do Lodash.
 *
 * @param collection array ou objeto cujos elementos terão o método invocado
 * @param path caminho do método (string, array ou símbolo) ou a própria função
 * @param args argumentos a repassar na invocação
 * @returns array com os retornos de cada invocação
 */
export function invokeMap<T = unknown, R = unknown>(collection: MaybeRefOrGetter<T[] | Record<string, T> | null | undefined>, path: unknown, ...args: unknown[]): R[] {
    const data = toValue(collection);
    if (data == null) return [];

    const isFunc = typeof path === 'function';
    const items = Array.isArray(data) ? data : Object.values(data);

    return items.map((value) => (isFunc ? (path as (...a: unknown[]) => R).apply(value, args) : (baseInvoke(value, path, args) as R)));
}
