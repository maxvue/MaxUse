import { toValue, type MaybeRefOrGetter } from 'vue';
import { toPath } from '../Lang/toPath';
import { castPath } from './_castPath';

/**
 * Verifica se `path` é uma propriedade **própria e direta** de `object`
 * (não segue a cadeia de protótipos).
 * Semelhante ao _.has do Lodash.
 *
 * @param object objeto a verificar
 * @param path caminho da propriedade (string, array ou símbolo)
 * @returns `true` se o caminho existir como propriedade própria
 */
export function has(object: MaybeRefOrGetter<unknown>, path: MaybeRefOrGetter<unknown>): boolean {
    const data = toValue(object);
    if (data == null) return false;

    const segments = castPath(toValue(path), data, toPath);
    let current: unknown = data;

    for (let index = 0; index < segments.length; index++) {
        if (current == null) return false;
        const key = segments[index];
        if (!Object.prototype.hasOwnProperty.call(current, key)) return false;
        current = (current as Record<PropertyKey, unknown>)[key];
    }

    return segments.length > 0;
}
