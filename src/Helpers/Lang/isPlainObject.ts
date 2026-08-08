import { toValue, type MaybeRefOrGetter } from 'vue';

/**
 * Verifica se o valor é um objeto "simples" — criado pelo literal `{}`, por
 * `new Object()` ou com `Object.create(null)`. Instâncias de classe,
 * arrays, `Map`, `Date`, etc. não contam.
 * Semelhante ao _.isPlainObject do Lodash.
 *
 * @param value valor a verificar
 * @returns `true` se o valor for um objeto simples
 */
export function isPlainObject(value: MaybeRefOrGetter<unknown>): boolean {
    const data = toValue(value);
    if (data === null || typeof data !== 'object' || Object.prototype.toString.call(data) !== '[object Object]') return false;

    const proto = Object.getPrototypeOf(data);
    if (proto === null) return true;

    const Ctor = Object.prototype.hasOwnProperty.call(proto, 'constructor') && proto.constructor;
    return typeof Ctor === 'function' && Ctor instanceof Ctor && Function.prototype.toString.call(Ctor) === Function.prototype.toString.call(Object);
}
