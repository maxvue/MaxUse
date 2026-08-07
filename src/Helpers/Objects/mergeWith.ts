import { toValue, type MaybeRefOrGetter } from 'vue';
import { baseMerge } from './_baseMerge';

type Customizer = (objValue: unknown, srcValue: unknown, key: string, object: unknown, source: unknown, stack: Map<unknown, unknown>) => unknown;

/**
 * Como `merge`, mas aceita `customizer` — como **último** argumento —
 * invocado para cada par de valores mesclados. Se `customizer` retornar
 * `undefined`, o comportamento padrão de `merge` é usado para aquele par.
 * Semelhante ao _.mergeWith do Lodash.
 *
 * @param object objeto de destino (mutado in-place)
 * @param rest objetos fonte, seguidos do `customizer`
 * @returns o próprio `object`
 */
export function mergeWith<T extends object>(object: MaybeRefOrGetter<T | null | undefined>, ...rest: unknown[]): T {
    const raw = toValue(object);
    const data = (raw == null ? {} : Object(raw)) as T;

    // Só trata o último argumento como customizer se ele realmente for uma
    // função — caso contrário (ex.: última fonte é um objeto comum), todos
    // os argumentos em `rest` são fontes. Espelha o guard `typeof
    // customizer === 'function'` do Lodash.
    const last = rest[rest.length - 1];
    const hasCustomizer = typeof last === 'function';
    const customizer = hasCustomizer ? (last as Customizer) : undefined;
    const sources = hasCustomizer ? rest.slice(0, -1) : rest;

    for (const source of sources) baseMerge(data, source, customizer);
    return data;
}
