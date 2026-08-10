import { toValue, type MaybeRefOrGetter } from 'vue';
import { toPath } from '../Lang/toPath';
import { castPath } from './_castPath';

/**
 * Obtém o valor no caminho específico de um objeto.
 * Semelhante ao _.get do Lodash.
 *
 * @param object O objeto para consultar.
 * @param path O caminho da propriedade a ser obtida (string, array ou símbolo).
 * @param defaultValue O valor retornado se o caminho resolvido for undefined.
 * @returns Retorna o valor resolvido.
 */
export function get<T = unknown>(
    object: MaybeRefOrGetter<unknown>,
    path: MaybeRefOrGetter<unknown>,
    defaultValue?: T
): T {
    const data = toValue(object);
    if (data == null) return defaultValue as T;

    const segments = castPath(toValue(path), data, toPath);
    let result: unknown = data;

    for (const key of segments) {
        if (result == null) {
            result = undefined;
            break;
        }
        result = (result as Record<PropertyKey, unknown>)[key];
    }

    return result === undefined ? (defaultValue as T) : (result as T);
}
