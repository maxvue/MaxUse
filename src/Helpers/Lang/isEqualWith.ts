import { toValue, type MaybeRefOrGetter } from 'vue';

type EqualCustomizer = (value: unknown, other: unknown, key?: string | symbol, object?: unknown, source?: unknown, stack?: Map<unknown, unknown>) => boolean | undefined;

/**
 * Compara dois valores usando SameValueZero (`===`, mas `NaN` é igual a
 * `NaN`).
 *
 * @param a primeiro valor
 * @param b segundo valor
 * @returns `true` se os valores forem equivalentes
 */
function sameValueZero(a: unknown, b: unknown): boolean {
    return a === b || (a !== a && b !== b);
}

/**
 * Desembrulha objetos wrapper de primitivo (`new Boolean()`, `new Number()`,
 * `new String()`) para o valor primitivo correspondente. Qualquer outro
 * valor é retornado sem alteração.
 *
 * @param value valor a desembrulhar
 * @returns primitivo desembrulhado, ou o próprio `value` se não for wrapper
 */
function unwrapPrimitiveWrapper(value: unknown): unknown {
    if (value instanceof Boolean || value instanceof Number || value instanceof String) return value.valueOf();
    return value;
}

/**
 * Verifica se dois objetos "plain-like" (não array, não Date/RegExp/Map/Set)
 * têm o mesmo construtor/protótipo — instâncias de classes diferentes com
 * os mesmos campos não são consideradas iguais, mesmo que um objeto literal
 * (`{}`, protótipo `Object.prototype`) sempre combine com outro objeto
 * literal.
 *
 * @param a primeiro objeto
 * @param b segundo objeto
 * @returns `true` se ambos compartilham o mesmo construtor/protótipo
 */
function sameConstructor(a: object, b: object): boolean {
    const protoA = Object.getPrototypeOf(a);
    const protoB = Object.getPrototypeOf(b);
    if (protoA === protoB) return true;

    const CtorA = (protoA as { constructor?: unknown } | null)?.constructor;
    const CtorB = (protoB as { constructor?: unknown } | null)?.constructor;
    const isPlainA = protoA === null || CtorA === Object;
    const isPlainB = protoB === null || CtorB === Object;
    if (isPlainA && isPlainB) return true;

    return CtorA === CtorB;
}

/**
 * Comparação profunda recursiva entre dois valores, consultando
 * `customizer` (se fornecido) antes de cada comparação.
 *
 * @param a primeiro valor
 * @param b segundo valor
 * @param customizer função opcional para customizar a comparação
 * @param key chave do par no objeto pai (uso interno/recursivo)
 * @param object objeto pai de `a` (uso interno/recursivo)
 * @param source objeto pai de `b` (uso interno/recursivo)
 * @param stack pilha de rastreamento de referências circulares (uso interno/recursivo)
 * @returns `true` se os valores forem profundamente equivalentes
 */
function baseIsEqual(a: unknown, b: unknown, customizer?: EqualCustomizer, key?: string | symbol, object?: unknown, source?: unknown, stack?: Map<unknown, unknown>): boolean {
    if (customizer) {
        const result = object !== undefined ? customizer(a, b, key, object, source, stack) : customizer(a, b);
        if (result !== undefined) return result;
    }

    const ua = unwrapPrimitiveWrapper(a);
    const ub = unwrapPrimitiveWrapper(b);
    if (sameValueZero(ua, ub)) return true;

    // Se ambos os lados são wrappers de primitivo (`new Number()`, etc.) mas
    // o desembrulho acima não bateu, os valores primitivos são diferentes —
    // não cai para a comparação estrutural genérica (que os trataria como
    // objetos comuns de mesmas chaves vazias e daria falso positivo).
    if (ua !== a && ub !== b) return false;

    // Se o desembrulho mudou a natureza de algum lado para primitivo e o
    // outro lado permaneceu não-primitivo (ou vice-versa), a comparação
    // profunda abaixo segue com os valores originais — só o SameValueZero
    // acima usa a forma desembrulhada.
    if (a === null || b === null || typeof a !== 'object' || typeof b !== 'object') return false;

    if (a instanceof Date && b instanceof Date) return a.getTime() === b.getTime();
    if (a instanceof RegExp && b instanceof RegExp) return a.toString() === b.toString();

    if (a instanceof ArrayBuffer && b instanceof ArrayBuffer) {
        if (a.byteLength !== b.byteLength) return false;
        const viewA = new Uint8Array(a);
        const viewB = new Uint8Array(b);
        for (let i = 0; i < viewA.length; i++) if (viewA[i] !== viewB[i]) return false;
        return true;
    }

    if (ArrayBuffer.isView(a) && ArrayBuffer.isView(b) && !(a instanceof DataView) && !(b instanceof DataView)) {
        const ta = a as unknown as ArrayLike<number>;
        const tb = b as unknown as ArrayLike<number>;
        if (Object.getPrototypeOf(a) !== Object.getPrototypeOf(b) || ta.length !== tb.length) return false;
        for (let i = 0; i < ta.length; i++) if (!sameValueZero(ta[i], tb[i])) return false;
        return true;
    }

    stack = stack || new Map();
    if (stack.get(a) === b) return true;
    stack.set(a, b);

    if (a instanceof Map && b instanceof Map) {
        if (a.size !== b.size) return false;
        for (const [k, v] of a) if (!b.has(k) || !baseIsEqual(v, b.get(k), customizer, k, a, b, stack)) return false;

        return true;
    }

    if (a instanceof Set && b instanceof Set) {
        if (a.size !== b.size) return false;
        const arrayB = Array.from(b);
        for (const v of a) if (!arrayB.some((other) => baseIsEqual(v, other, customizer, undefined, a, b, stack))) return false;

        return true;
    }

    const isArrA = Array.isArray(a);
    const isArrB = Array.isArray(b);
    if (isArrA !== isArrB) return false;

    if (isArrA && isArrB) {
        if (a.length !== b.length) return false;
        for (let i = 0; i < a.length; i++) if (!baseIsEqual(a[i], b[i], customizer, String(i), a, b, stack)) return false;

        return true;
    }

    if (!sameConstructor(a, b)) return false;

    const keysA = [...Object.keys(a), ...Object.getOwnPropertySymbols(a)];
    const keysB = [...Object.keys(b), ...Object.getOwnPropertySymbols(b)];
    if (keysA.length !== keysB.length) return false;

    for (const k of keysA) {
        if (!Object.prototype.hasOwnProperty.call(b, k)) return false;
        if (!baseIsEqual((a as Record<string | symbol, unknown>)[k], (b as Record<string | symbol, unknown>)[k], customizer, k, a, b, stack)) return false;
    }
    return true;
}

/**
 * Compara dois valores como {@link import('../Objects/isEqual').isEqual}
 * (comparação profunda, SameValueZero), mas consultando `customizer` para
 * cada par de valores comparado (em qualquer profundidade). Se o
 * `customizer` retornar algo diferente de `undefined`, esse resultado
 * decide aquele par; caso contrário, a comparação padrão continua.
 * Semelhante ao _.isEqualWith do Lodash.
 *
 * @param value primeiro valor
 * @param other segundo valor
 * @param customizer função opcional para customizar a comparação por par de valores
 * @returns `true` se os valores forem equivalentes
 */
export function isEqualWith(value: MaybeRefOrGetter<unknown>, other: MaybeRefOrGetter<unknown>, customizer?: EqualCustomizer): boolean {
    const a = toValue(value);
    const b = toValue(other);
    const fn = typeof customizer === 'function' ? customizer : undefined;
    return baseIsEqual(a, b, fn);
}
