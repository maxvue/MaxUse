import { toValue, type MaybeRefOrGetter } from 'vue';
import { keysIn } from './keysIn';

/**
 * Atribui as propriedades próprias e herdadas de cada objeto em `sources`
 * a `object`, apenas para as propriedades de destino que resolvem para
 * `undefined`. Fontes são aplicadas da esquerda para a direita; assim que
 * uma propriedade é definida, valores adicionais para a mesma propriedade
 * são ignorados. Muta e retorna `object`.
 * Semelhante ao _.defaults do Lodash.
 *
 * @param object objeto de destino (mutado in-place)
 * @param sources objetos fonte, aplicados em ordem
 * @returns o próprio `object`
 */
export function defaults<T extends object>(object: MaybeRefOrGetter<T | null | undefined>, ...sources: Array<unknown | null | undefined>): T {
    const raw = toValue(object);
    const data = (raw == null ? {} : Object(raw)) as Record<PropertyKey, unknown>;

    for (const source of sources) {
        if (!source) continue;
        for (const key of keysIn(source)) if (data[key] === undefined) data[key] = (source as Record<PropertyKey, unknown>)[key];

    }

    return data as T;
}
