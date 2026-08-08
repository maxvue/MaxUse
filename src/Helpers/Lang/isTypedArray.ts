import { toValue, type MaybeRefOrGetter } from 'vue';

const typedArrayTags = new Set([
    '[object Float32Array]',
    '[object Float64Array]',
    '[object Int8Array]',
    '[object Int16Array]',
    '[object Int32Array]',
    '[object Uint8Array]',
    '[object Uint8ClampedArray]',
    '[object Uint16Array]',
    '[object Uint32Array]',
    '[object BigInt64Array]',
    '[object BigUint64Array]'
]);

/**
 * Verifica se o valor é um `TypedArray` (ex.: `Int8Array`, `Float64Array`).
 * Semelhante ao _.isTypedArray do Lodash.
 *
 * @param value valor a verificar
 * @returns `true` se o valor for um TypedArray
 */
export function isTypedArray(value: MaybeRefOrGetter<unknown>): boolean {
    const data = toValue(value);
    return data !== null && typeof data === 'object' && typedArrayTags.has(Object.prototype.toString.call(data));
}
