import { toValue, type MaybeRefOrGetter } from 'vue';
import { keys } from './keys';

/**
 * Atribui as propriedades **próprias** enumeráveis de cada objeto em
 * `sources` a `object`, da esquerda para a direita — fontes posteriores
 * sobrescrevem propriedades anteriores. Muta e retorna `object`. Se
 * `object` for `null`/`undefined`, é tratado como `Object(object)` (um
 * objeto novo vazio), espelhando o Lodash.
 * Semelhante ao _.assign do Lodash.
 *
 * @param object objeto de destino (mutado in-place)
 * @param sources objetos fonte, aplicados em ordem
 * @returns o próprio `object`
 */
export function assign<T extends object>(object: MaybeRefOrGetter<T | null | undefined>, ...sources: Array<unknown | null | undefined>): T {
    const raw = toValue(object);
    const data = (raw == null ? {} : Object(raw)) as T;
    for (const source of sources) {
        if (!source) continue;
        for (const key of keys(source)) (data as Record<PropertyKey, unknown>)[key] = (source as Record<PropertyKey, unknown>)[key];
    }
    return data;
}
