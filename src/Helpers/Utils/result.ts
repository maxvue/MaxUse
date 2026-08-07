import { toValue, type MaybeRefOrGetter } from 'vue';
import { toPath } from '../Lang/toPath';
import { castPath } from '../Objects/_castPath';

/**
 * Obtém o valor no `path` de `object`. Se o valor resolvido em qualquer
 * segmento do caminho for uma função, ela é invocada (com `this` ligado a
 * seu objeto pai) e o retorno passa a ser usado na continuação da busca.
 * Se o caminho não resolver (valor `undefined` em algum ponto),
 * `defaultValue` é usado; se `defaultValue` for uma função, ela também é
 * invocada.
 * Semelhante ao _.result do Lodash.
 *
 * @param object objeto a consultar
 * @param path caminho da propriedade (string, array ou símbolo)
 * @param defaultValue valor (ou função) usado quando o caminho não resolve
 * @returns o valor resolvido (ou invocado), ou `defaultValue`
 */
export function result(object: MaybeRefOrGetter<unknown>, path: MaybeRefOrGetter<unknown>, defaultValue?: unknown): unknown {
    const data = toValue(object);
    const segments = castPath(toValue(path), data, toPath);
    let length = segments.length;
    let current: unknown = data;

    if (!length) {
        length = 1;
        current = undefined;
    }

    for (let index = 0; index < length; index++) {
        let value = current == null ? undefined : (current as Record<PropertyKey, unknown>)[segments[index] as PropertyKey];
        if (value === undefined) {
            index = length;
            value = defaultValue;
        }
        current = typeof value === 'function' ? (value as (...a: unknown[]) => unknown).call(current) : value;
    }

    return current;
}
