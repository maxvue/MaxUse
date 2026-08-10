import { toValue, type MaybeRefOrGetter } from 'vue';
import { toPath } from '../Lang/toPath';
import { castPath } from './_castPath';

/**
 * Remove a propriedade em um caminho específico de um objeto.
 * Semelhante ao _.unset do Lodash.
 *
 * @param object O objeto a ser modificado.
 * @param path O caminho da propriedade a ser removida.
 * @returns Retorna true se a propriedade for removida com sucesso, caso contrário false.
 */
export function unset(object: MaybeRefOrGetter<unknown>, path: MaybeRefOrGetter<unknown>): boolean {
    const data = toValue(object);
    if (data == null || typeof data !== 'object') return false;

    const segments = castPath(toValue(path), data, toPath);
    if (segments.length === 0) return true;

    let current = data as Record<PropertyKey, unknown>;
    for (let i = 0; i < segments.length - 1; i++) {
        const key = segments[i];
        if (key === '__proto__' || key === 'constructor' || key === 'prototype') return true;
        if (!(key in current)) return true;
        const next = current[key];
        if (next == null || typeof next !== 'object') return true;
        current = next as Record<PropertyKey, unknown>;
    }

    const lastKey = segments[segments.length - 1];
    if (lastKey === '__proto__' || lastKey === 'constructor' || lastKey === 'prototype') return true;

    return delete current[lastKey];
}
