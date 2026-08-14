import { toValue, type MaybeRefOrGetter } from 'vue';
import { keysIn } from './keysIn';
import { baseAssignValue } from './_baseAssignValue';

type Customizer = (objValue: unknown, srcValue: unknown, key: PropertyKey, object: unknown, source: unknown) => unknown;

/**
 * Como `assignIn`, mas aceita `customizer` — como **último** argumento —
 * para determinar o valor atribuído a cada propriedade (própria ou
 * herdada). Se `customizer` retornar `undefined`, o comportamento padrão
 * é usado para aquela propriedade.
 * Semelhante ao _.assignInWith do Lodash.
 *
 * @param object objeto de destino (mutado in-place)
 * @param rest objetos fonte, seguidos do `customizer`
 * @returns o próprio `object`
 */
export function assignInWith<T extends object>(object: MaybeRefOrGetter<T | null | undefined>, ...rest: unknown[]): T {
    const raw = toValue(object);
    const data = (raw == null ? {} : Object(raw)) as T;

    // Só trata o último argumento como customizer se ele realmente for uma
    // função — caso contrário, todos os argumentos em `rest` são fontes.
    const last = rest[rest.length - 1];
    const hasCustomizer = typeof last === 'function';
    const customizer = hasCustomizer ? (last as Customizer) : undefined;
    const sources = hasCustomizer ? rest.slice(0, -1) : rest;

    for (const source of sources) {
        if (!source) continue;
        for (const key of keysIn(source)) {
            const srcValue = (source as Record<PropertyKey, unknown>)[key];
            const objValue = (data as Record<PropertyKey, unknown>)[key];
            const result = customizer ? customizer(objValue, srcValue, key, data, source) : undefined;
            baseAssignValue(data as Record<PropertyKey, unknown>, key, result === undefined ? srcValue : result);
        }
    }
    return data;
}
