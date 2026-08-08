/**
 * Implementação interna compartilhada por `clone`, `cloneWith` e
 * `cloneDeepWith`. Não é exportada no barrel da categoria — é um detalhe de
 * implementação, não um helper público do manifesto de migração.
 *
 * Replica o algoritmo do `baseClone` do Lodash: clonagem shallow ou deep,
 * com customizer opcional, preservando o tipo de `Date`, `RegExp`, `Map`,
 * `Set`, `TypedArray`, `ArrayBuffer`, `Boolean`/`Number`/`String` (objetos
 * wrapper) e instâncias de classe (mantém o protótipo). Trata referências
 * circulares com uma pilha de rastreamento.
 *
 * Peculiaridade preservada do original: `Map`/`Set` sempre recursam nas
 * suas entradas, mesmo em clonagem shallow — os valores de um `Map`/`Set`
 * clonado não compartilham identidade com os originais mesmo quando
 * `isDeep` é `false`. Já objetos e arrays comuns, em modo shallow, copiam
 * as chaves de primeiro nível sem recursão.
 */

type Customizer = (value: unknown, key?: string | symbol, object?: unknown, stack?: Map<unknown, unknown>) => unknown;

/**
 * Inicializa o clone de um array, preservando propriedades extras
 * atribuídas por `RegExp#exec` (`index`, `input`).
 *
 * @param array array de origem
 * @returns novo array vazio do mesmo tamanho
 */
function initCloneArray(array: unknown[]): unknown[] {
    const length = array.length;
    const result = new (array.constructor as ArrayConstructor)(length);
    if (length && typeof array[0] === 'string' && Object.prototype.hasOwnProperty.call(array, 'index')) {
        (result as unknown as { index: unknown }).index = (array as unknown as { index: unknown }).index;
        (result as unknown as { input: unknown }).input = (array as unknown as { input: unknown }).input;
    }
    return result;
}

/**
 * Inicializa o clone de um objeto comum, preservando o protótipo.
 *
 * @param object objeto de origem
 * @returns novo objeto com o mesmo protótipo
 */
function initCloneObject(object: object): object {
    if (typeof (object as { constructor?: unknown }).constructor === 'function' && !isPrototypeObject(object)) return Object.create(Object.getPrototypeOf(object));

    return {};
}

/**
 * Verifica se um objeto é ele mesmo um protótipo (`Foo.prototype`).
 *
 * @param value objeto a verificar
 * @returns `true` se for um objeto-protótipo
 */
function isPrototypeObject(value: object): boolean {
    const Ctor = (value as { constructor?: { prototype?: unknown } }).constructor;
    const proto = typeof Ctor === 'function' ? Ctor.prototype : Object.prototype;
    return value === proto;
}

/**
 * Inicializa o clone de valores com tag reconhecível (`Date`, `RegExp`,
 * `Map`, `Set`, wrappers de primitivo, `TypedArray`, `ArrayBuffer`).
 *
 * @param object valor de origem
 * @param tag resultado de `Object.prototype.toString.call`
 * @param isDeep `true` para clonagem profunda — em clonagem shallow, o
 * buffer de `TypedArray`/`DataView` é compartilhado com o original, igual
 * ao Lodash
 * @returns clone inicial (containers ainda vazios para Map/Set)
 */
function initCloneByTag(object: any, tag: string, isDeep: boolean): unknown {
    const Ctor = object.constructor;
    switch (tag) {
        case '[object ArrayBuffer]':
            return object.slice(0);
        case '[object Boolean]':
        case '[object Date]':
            return new Ctor(+object);
        case '[object DataView]': {
            const buffer = isDeep ? object.buffer.slice(0) : object.buffer;
            return new Ctor(buffer, object.byteOffset, object.byteLength);
        }
        case '[object Float32Array]':
        case '[object Float64Array]':
        case '[object Int8Array]':
        case '[object Int16Array]':
        case '[object Int32Array]':
        case '[object Uint8Array]':
        case '[object Uint8ClampedArray]':
        case '[object Uint16Array]':
        case '[object Uint32Array]':
        case '[object BigInt64Array]':
        case '[object BigUint64Array]': {
            const buffer = isDeep ? object.buffer.slice(0) : object.buffer;
            return new Ctor(buffer, object.byteOffset, object.length);
        }
        case '[object Map]':
            return new Map();
        case '[object Number]':
        case '[object String]':
            return new Ctor(object);
        case '[object RegExp]': {
            const result = new RegExp(object.source, /\w*$/.exec(object.toString())?.[0]);
            result.lastIndex = object.lastIndex;
            return result;
        }
        case '[object Set]':
            return new Set();
        case '[object Symbol]':
            return Object(Symbol.prototype.valueOf.call(object));
        default:
            return undefined;
    }
}

const cloneableTags = new Set([
    '[object Arguments]', '[object Array]', '[object ArrayBuffer]', '[object DataView]',
    '[object Boolean]', '[object Date]', '[object Float32Array]', '[object Float64Array]',
    '[object Int8Array]', '[object Int16Array]', '[object Int32Array]', '[object Map]',
    '[object Number]', '[object Object]', '[object RegExp]', '[object Set]', '[object String]',
    '[object Symbol]', '[object Uint8Array]', '[object Uint8ClampedArray]', '[object Uint16Array]',
    '[object Uint32Array]', '[object BigInt64Array]', '[object BigUint64Array]'
]);

/**
 * Clona `value` seguindo o algoritmo do Lodash (`baseClone`).
 *
 * @param value valor a clonar
 * @param isDeep `true` para clonagem profunda
 * @param customizer função opcional para customizar a clonagem por valor
 * @param key chave do valor no objeto pai (uso interno/recursivo)
 * @param object objeto pai (uso interno/recursivo)
 * @param stack pilha de rastreamento de referências circulares (uso interno/recursivo)
 * @returns o valor clonado
 */
export function baseClone(value: unknown, isDeep: boolean, customizer?: Customizer, key?: string | symbol, object?: unknown, stack?: Map<unknown, unknown>): unknown {
    let result: unknown;

    if (customizer) result = object !== undefined ? customizer(value, key, object, stack) : customizer(value);

    if (result !== undefined) return result;

    if (value === null || (typeof value !== 'object' && typeof value !== 'function')) return value;

    const isArr = Array.isArray(value);
    if (isArr) {
        result = initCloneArray(value as unknown[]);
        if (!isDeep) return Object.assign(result as unknown[], value);
    } else {
        const tag = Object.prototype.toString.call(value);
        const isFunc = tag === '[object Function]' || tag === '[object GeneratorFunction]' || tag === '[object AsyncFunction]';

        if (tag === '[object Object]' || tag === '[object Arguments]' || (isFunc && object === undefined)) {
            result = isFunc ? {} : initCloneObject(value as object);
            if (!isDeep) return Object.assign(result as object, value);
        } else {
            if (!cloneableTags.has(tag)) return object !== undefined ? value : {};
            result = initCloneByTag(value, tag, isDeep);
        }
    }

    stack = stack || new Map();
    const stacked = stack.get(value);
    if (stacked !== undefined) return stacked;
    stack.set(value, result);

    if (value instanceof Set) value.forEach((subValue) => {
        (result as Set<unknown>).add(baseClone(subValue, isDeep, customizer, undefined, value, stack));
    });
    else if (value instanceof Map) value.forEach((subValue, subKey) => {
        (result as Map<unknown, unknown>).set(subKey, baseClone(subValue, isDeep, customizer, subKey, value, stack));
    });


    if (isArr) {
        const arr = value as unknown[];
        for (let i = 0; i < arr.length; i++) (result as unknown[])[i] = baseClone(arr[i], isDeep, customizer, String(i), value, stack);

    } else if (Object.prototype.toString.call(value) === '[object Object]' || Object.prototype.toString.call(value) === '[object Arguments]') {
        const keys = [...Object.keys(value as object), ...Object.getOwnPropertySymbols(value as object)];
        for (const k of keys) (result as Record<string | symbol, unknown>)[k] = baseClone((value as Record<string | symbol, unknown>)[k], isDeep, customizer, k, value, stack);

    }

    return result;
}
