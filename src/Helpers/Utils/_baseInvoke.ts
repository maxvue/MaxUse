import { toPath } from '../Lang/toPath';
import { castPath } from '../Objects/_castPath';
import { baseGet } from './_baseGet';

/**
 * Invoca o método localizado em `path` de `object`, usando o penúltimo
 * segmento do caminho como `this` (o "pai" do método). Retorna `undefined`
 * se o caminho não resolver para uma função.
 * Auxiliar interno compartilhado por `method` e `methodOf` — espelha
 * `baseInvoke` do Lodash. Não é exportado no barrel da categoria.
 *
 * @param object objeto a consultar
 * @param path caminho do método (string, array ou símbolo)
 * @param args argumentos a repassar na chamada
 * @returns o retorno do método invocado, ou `undefined`
 */
export function baseInvoke(object: unknown, path: unknown, args: unknown[]): unknown {
    const segments = castPath(path, object, toPath);
    const parent = segments.length < 2 ? object : baseGet(object, segments.slice(0, -1));
    const key = segments[segments.length - 1];
    const func = parent == null ? parent : (parent as Record<PropertyKey, unknown>)[key as PropertyKey];
    return typeof func === 'function' ? (func as (...a: unknown[]) => unknown).apply(parent, args) : undefined;
}
