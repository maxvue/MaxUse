import { toValue, type MaybeRefOrGetter } from 'vue';
import { isPlainObject } from './isPlainObject';

/**
 * Verifica se o valor é um elemento DOM.
 * Semelhante ao _.isElement do Lodash.
 *
 * @param value valor a verificar
 * @returns `true` se o valor for um elemento DOM
 */
export function isElement(value: MaybeRefOrGetter<unknown>): boolean {
    const data = toValue(value);
    if (data === null || typeof data !== 'object') return false;
    const candidate = data as { nodeType?: unknown };
    return candidate.nodeType === 1 && !isPlainObject(data);
}
