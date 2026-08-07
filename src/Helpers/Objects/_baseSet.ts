import { toPath } from '../Lang/toPath';
import { castPath } from './_castPath';

const MAX_SAFE_INTEGER = 9007199254740991;
const reIsUint = /^(?:0|[1-9]\d*)$/;

/**
 * Verifica se `value` é um índice de array-like válido. Espelha `isIndex`
 * do Lodash.
 */
function isIndex(value: unknown, length = MAX_SAFE_INTEGER): boolean {
    const type = typeof value;
    return !!length && (type === 'number' || (type !== 'symbol' && reIsUint.test(String(value)))) && ((value as number) > -1 && (value as number) % 1 === 0 && (value as number) < length);
}

type Customizer = (nsValue: unknown, key: PropertyKey, nsObject: unknown) => unknown;

/**
 * Define `value` no `path` de `object`, criando estruturas intermediárias
 * conforme necessário. Se `customizer` for fornecido, ele é consultado
 * para decidir a estrutura intermediária a criar em cada nível — se
 * retornar `undefined`, cai no comportamento padrão (array quando o
 * próximo segmento é um índice válido, objeto plano caso contrário).
 * Auxiliar interno compartilhado por `set`, `setWith`, `update` e
 * `updateWith` — espelha `baseSet` do Lodash. Não é exportado no barrel
 * da categoria.
 *
 * @param object objeto raiz a modificar (mutado in-place)
 * @param path caminho onde definir o valor
 * @param value valor a atribuir
 * @param customizer função opcional para customizar a criação de estruturas intermediárias
 * @returns o próprio `object`
 */
export function baseSet<T>(object: T, path: unknown, value: unknown, customizer?: Customizer): T {
    if (object === null || typeof object !== 'object') return object;

    const segments = castPath(path, object, toPath);
    let nested: Record<PropertyKey, unknown> = object as Record<PropertyKey, unknown>;

    for (let index = 0; index < segments.length; index++) {
        const key = segments[index] as PropertyKey;
        if (key === '__proto__' || key === 'constructor' || key === 'prototype') return object;

        if (index !== segments.length - 1) {
            const existing = nested[key];
            let newValue = customizer ? customizer(existing, key, nested) : undefined;
            if (newValue === undefined) newValue = existing !== null && typeof existing === 'object' ? existing : (isIndex(segments[index + 1]) ? [] : {});

            nested[key] = newValue;
            nested = nested[key] as Record<PropertyKey, unknown>;
        } else nested[key] = value;

    }

    return object;
}
