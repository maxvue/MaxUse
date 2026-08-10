import { isPlainObject } from '../Lang/isPlainObject';
import { isArrayLikeObject } from '../Lang/isArrayLikeObject';
import { keysIn } from './keysIn';

type Customizer = (objValue: unknown, srcValue: unknown, key: string, object: unknown, source: unknown, stack: Map<unknown, unknown>) => unknown;

function isObjectValue(value: unknown): boolean {
    const type = typeof value;
    return value != null && (type === 'object' || type === 'function');
}

function sameValueZero(a: unknown, b: unknown): boolean {
    return a === b || (a !== a && b !== b);
}

/**
 * Atribui `value` a `object[key]`, mas nunca com `undefined` — pula a
 * atribuição se `value` for `undefined` e a chave já existir em `object`
 * (mesmo com valor `undefined`), ou se o valor atual já for
 * SameValueZero-igual a `value`.
 * Espelha `assignMergeValue` do Lodash.
 */
function assignMergeValue(object: Record<PropertyKey, unknown>, key: PropertyKey, value: unknown): void {
    if ((value !== undefined && !sameValueZero(object[key], value)) || (value === undefined && !(key in object))) object[key] = value;

}

/**
 * Decide o valor mesclado para uma chave cujo `srcValue` é objeto/array
 * (arrays, objetos simples, `arguments`), recursando via `mergeFunc` para
 * combinar `objValue` e `srcValue` estrutura a estrutura. Mantém o tipo de
 * `objValue` quando compatível (ex.: array existente absorve novos
 * índices); caso contrário, cria uma nova estrutura do tipo de `srcValue`.
 * Espelha `baseMergeDeep` do Lodash.
 */
function baseMergeDeep(
    object: Record<PropertyKey, unknown>,
    source: Record<PropertyKey, unknown>,
    key: string,
    mergeFunc: (object: unknown, source: unknown, customizer?: Customizer, stack?: Map<unknown, unknown>) => void,
    customizer: Customizer | undefined,
    stack: Map<unknown, unknown>
): void {
    const objValue = object[key];
    const srcValue = source[key];
    const stacked = stack.get(srcValue);

    if (stacked !== undefined) {
        assignMergeValue(object, key, stacked);
        return;
    }

    let newValue = customizer ? customizer(objValue, srcValue, key, object, source, stack) : undefined;
    let isCommon = newValue === undefined;

    if (isCommon) {
        const isArr = Array.isArray(srcValue);
        newValue = srcValue;

        if (isArr) newValue = Array.isArray(objValue) ? objValue : (isArrayLikeObject(objValue) ? Array.from(objValue as ArrayLike<unknown>) : []);
        else if (isPlainObject(srcValue) || Object.prototype.toString.call(srcValue) === '[object Arguments]') {
            newValue = objValue;
            if (!isObjectValue(objValue) || typeof objValue === 'function') newValue = {};
        } else isCommon = false;

    }

    if (isCommon) {
        stack.set(srcValue, newValue);
        mergeFunc(newValue, srcValue, customizer, stack);
        stack.delete(srcValue);
    }

    assignMergeValue(object, key, newValue);
}

/**
 * Mescla profundamente `source` em `object`: para cada chave (própria e
 * herdada) de `source`, se o valor for objeto/array, mescla
 * recursivamente preservando estruturas existentes compatíveis; caso
 * contrário, atribui diretamente (via `customizer`, se fornecido).
 * `undefined` em `source` nunca sobrescreve um valor já presente.
 * Auxiliar interno compartilhado por `merge` e `mergeWith` — espelha
 * `baseMerge` do Lodash. Não é exportado no barrel da categoria.
 *
 * @param object objeto de destino (mutado in-place)
 * @param source objeto fonte
 * @param customizer função opcional para customizar valores mesclados
 * @param stack rastreamento de referências circulares (uso interno/recursivo)
 */
export function baseMerge(object: unknown, source: unknown, customizer?: Customizer, stack: Map<unknown, unknown> = new Map()): void {
    // Espelha o guard real do Lodash: `object` precisa ser mutável
    // (objeto/array/função), mas `source` só precisa ser truthy — inclusive
    // primitivos como string ou number passam (`keysIn` decide, sozinho,
    // quantas chaves eles têm; para number, zero chaves, então o loop
    // simplesmente não faz nada).
    if (object === source || !isObjectValue(object) || !source) return;

    const dest = object as Record<PropertyKey, unknown>;
    const src = source as Record<PropertyKey, unknown>;

    for (const key of keysIn(src)) {
        if (key === '__proto__' || key === 'constructor' || key === 'prototype') continue;
        const srcValue = src[key];
        if (isObjectValue(srcValue)) baseMergeDeep(dest, src, key, baseMerge, customizer, stack);
        else {
            let newValue = customizer ? customizer(dest[key], srcValue, key, dest, src, stack) : undefined;
            if (newValue === undefined) newValue = srcValue;
            assignMergeValue(dest, key, newValue);
        }
    }
}
