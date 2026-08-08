import { toPath } from '../Lang/toPath';
import { castPath } from '../Objects/_castPath';

/**
 * Obtém o valor no caminho especificado de `object`, sem aplicar
 * `defaultValue` — retorna `undefined` quando o caminho não resolve.
 * Auxiliar interno compartilhado por `property`, `propertyOf`,
 * `matchesProperty`, `result`, `method` e `methodOf` — espelha `baseGet`
 * do Lodash. Não é exportado no barrel da categoria.
 *
 * @param object objeto a consultar
 * @param path caminho (string, array ou símbolo)
 * @returns o valor resolvido, ou `undefined`
 */
export function baseGet(object: unknown, path: unknown): unknown {
    const segments = castPath(path, object, toPath);
    let current: unknown = object;
    let index = 0;
    while (current != null && index < segments.length) current = (current as Record<PropertyKey, unknown>)[segments[index++] as PropertyKey];

    return index && index === segments.length ? current : undefined;
}
