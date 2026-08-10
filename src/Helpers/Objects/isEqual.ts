import { toValue, type MaybeRefOrGetter } from 'vue';

/**
 * Realiza uma comparação profunda entre dois valores para determinar se eles são equivalentes.
 * Semelhante ao _.isEqual do Lodash.
 *
 * @param value O valor a ser comparado.
 * @param other O outro valor a ser comparado.
 * @returns Retorna true se os valores forem equivalentes, caso contrário false.
 */
export function isEqual(value: MaybeRefOrGetter<any>, other: MaybeRefOrGetter<any>, stack = new WeakMap<object, any>()): boolean {
    const a = toValue(value);
    const b = toValue(other);

    // Comparação estrita (lida com primitivos e mesmas referências)
    if (a === b) return true;

    // Lida com NaN (único valor no JS que não é igual a si mesmo)
    if (Number.isNaN(a) && Number.isNaN(b)) return true;

    // Se um for nulo ou não for objeto (e não passaram na comparação estrita acima), são diferentes
    if (a === null || b === null || typeof a !== 'object' || typeof b !== 'object') return false;

    // Checagem de referências circulares
    const seen = stack.get(a);
    if (seen !== undefined) return seen === b;
    stack.set(a, b);

    // Lida com instâncias de Date
    if (a instanceof Date && b instanceof Date) return a.getTime() === b.getTime();

    // Lida com instâncias de RegExp
    if (a instanceof RegExp && b instanceof RegExp) return a.toString() === b.toString();

    // Lida com instâncias de Map
    if (a instanceof Map && b instanceof Map) {
        if (a.size !== b.size) return false;
        for (const [key, val] of a) if (!b.has(key) || !isEqual(val, b.get(key), stack)) return false;

        return true;
    }

    // Lida com instâncias de Set
    if (a instanceof Set && b instanceof Set) {
        if (a.size !== b.size) return false;
        const arrayB = Array.from(b);
        // Verificação lenta para Set de objetos, mas necessária para comparação profunda
        for (const valA of a) if (!arrayB.some((valB) => isEqual(valA, valB, stack))) return false;

        return true;
    }

    // Lida com Arrays
    const isArrayA = Array.isArray(a);
    const isArrayB = Array.isArray(b);
    if (isArrayA !== isArrayB) return false;

    if (isArrayA && isArrayB) {
        if (a.length !== b.length) return false;
        for (let i = 0; i < a.length; i++) if (!isEqual(a[i], b[i], stack)) return false;

        return true;
    }

    // Lida com Objetos comuns
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);

    if (keysA.length !== keysB.length) return false;

    for (const key of keysA) if (!Object.prototype.hasOwnProperty.call(b, key) || !isEqual(a[key], b[key], stack)) return false;

    return true;
}
