import { toValue, type MaybeRefOrGetter } from 'vue';
import { isPlainObject } from '../Lang/isPlainObject';
import { isObject } from '../Types/isObject';
import { deepClone } from './deepClone';

/**
 * Mescla `source` dentro de `target`, recursivamente.
 * O `stack` guarda as origens já visitadas nesta passagem, evitando estouro de
 * pilha quando a fonte contém referências circulares (`a.self = a`, `a.b.a = a`).
 *
 * @param target Objeto que recebe as propriedades (mutado).
 * @param source Objeto simples de origem.
 * @param stack Mapa de origens já visitadas nesta mesclagem.
 */
function mergeInto(target: any, source: any, stack: Map<unknown, unknown>): void {
    if (!isObject(target) || Array.isArray(target) || !isPlainObject(source)) return;
    if (stack.has(source)) return;

    stack.set(source, target);

    Object.keys(source).forEach((key) => {
        if (key === '__proto__' || key === 'constructor' || key === 'prototype') return;
        const sourceValue = toValue(source[key]);

        if (isPlainObject(sourceValue)) {
            if (stack.has(sourceValue)) {
                target[key] = stack.get(sourceValue);
                return;
            }

            if (!isObject(target[key]) || Array.isArray(target[key])) target[key] = {};

            mergeInto(target[key], sourceValue, stack);
        } else target[key] = deepClone(sourceValue);
    });

    stack.delete(source);
}

/**
 * Une dois ou mais objetos de forma profunda, mesclando inclusive propriedades aninhadas.
 * Útil para lidar com configurações padrão que precisam ser sobrescritas parcialmente por configurações do usuário.
 *
 * Suporta referências circulares na origem e não compartilha referências com ela:
 * arrays, `Date`, `Map`, `Set` e instâncias de classe são clonados via `deepClone`.
 *
 * @param target O objeto alvo que receberá as propriedades.
 * @param sources Um ou mais objetos de origem para mesclar.
 * @returns O objeto mesclado (modifica o primeiro objeto e o retorna).
 */
export function deepMerge<T extends object>(target: MaybeRefOrGetter<T>, ...sources: any[]): T {
    const dataTarget = toValue(target) as any;

    sources.forEach((source) => mergeInto(dataTarget, toValue(source), new Map()));

    return dataTarget;
}
