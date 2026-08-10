import { toValue, type MaybeRefOrGetter } from 'vue';
import { baseClone } from '../Lang/_baseClone';

/**
 * Cria uma cópia profunda de um valor, lidando com referências circulares e diversos tipos de dados.
 * Semelhante ao _.cloneDeep do Lodash.
 *
 * Instâncias de classe têm o protótipo preservado: o clone continua respondendo
 * a `instanceof` e mantém os métodos da classe original.
 *
 * @param value O valor a ser clonado.
 * @param map Um WeakMap para rastrear referências circulares (uso interno).
 * @returns Uma cópia profunda do valor.
 */
export function deepClone<T>(value: MaybeRefOrGetter<T>, map = new WeakMap()): T {
    // Resolve o valor se for uma Ref ou Getter do Vue
    const data = toValue(value);

    // Se não for um objeto ou for nulo, retorna o próprio valor (primitivos)
    if (data === null || typeof data !== 'object') return data as T;

    // Se já clonamos este objeto, retorna a referência existente (evita loops infinitos)
    if (map.has(data)) return map.get(data);

    let clone: any;

    // Lida com instâncias de Date
    if (data instanceof Date) return new Date(data.getTime()) as any;

    // Lida com instâncias de RegExp (preservando lastIndex)
    if (data instanceof RegExp) {
        const result = new RegExp(data.source, data.flags);
        result.lastIndex = data.lastIndex;
        return result as any;
    }

    // Lida com instâncias de Error (preservando message, name e stack)
    if (data instanceof Error) {
        const Ctor = (data.constructor as any) || Error;
        const errClone = new Ctor(data.message);
        errClone.name = data.name;
        errClone.stack = data.stack;
        map.set(data, errClone);
        const keys = [...Object.keys(data), ...Object.getOwnPropertySymbols(data)];
        for (const key of keys) errClone[key] = deepClone((data as any)[key], map);
        return errClone as T;
    }

    // Lida com instâncias de Map
    if (data instanceof Map) {
        clone = new Map();
        map.set(data, clone);
        data.forEach((val, key) => {
            clone.set(deepClone(key, map), deepClone(val, map));
        });
        return clone;
    }

    // Lida com instâncias de Set
    if (data instanceof Set) {
        clone = new Set();
        map.set(data, clone);
        data.forEach((val) => {
            clone.add(deepClone(val, map));
        });
        return clone;
    }

    // Lida com TypedArray, ArrayBuffer e DataView delegando ao baseClone
    if (ArrayBuffer.isView(data) || data instanceof ArrayBuffer || Object.prototype.toString.call(data) === '[object DataView]') return baseClone(data, true) as T;

    // Lida com Arrays e Objetos comuns, preservando o protótipo da instância
    if (Array.isArray(data)) clone = [];
    else {
        const proto = Object.getPrototypeOf(data);
        clone = proto === null ? Object.create(null) : Object.create(proto);
    }

    map.set(data, clone);

    // Copia propriedades recursivamente
    const keys = [...Object.keys(data), ...Object.getOwnPropertySymbols(data)];
    for (const key of keys) clone[key] = deepClone((data as any)[key], map);

    return clone as T;
}

