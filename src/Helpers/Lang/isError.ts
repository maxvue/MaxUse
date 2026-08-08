import { toValue, type MaybeRefOrGetter } from 'vue';
import { isPlainObject } from './isPlainObject';

/**
 * Verifica se o valor é um objeto de erro (`Error`, `DOMException` ou
 * qualquer objeto não-simples com campos `name` e `message` do tipo string).
 * Semelhante ao _.isError do Lodash.
 *
 * @param value valor a verificar
 * @returns `true` se o valor for um objeto de erro
 */
export function isError(value: MaybeRefOrGetter<unknown>): boolean {
    const data = toValue(value);
    if (data === null || typeof data !== 'object') return false;

    const tag = Object.prototype.toString.call(data);
    if (tag === '[object Error]' || tag === '[object DOMException]') return true;

    const candidate = data as { name?: unknown; message?: unknown };
    return typeof candidate.message === 'string' && typeof candidate.name === 'string' && !isPlainObject(data);
}
