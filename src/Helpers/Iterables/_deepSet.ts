import { toPath } from '../Lang/toPath';
import { castPath } from '../Objects/_castPath';

const MAX_SAFE_INTEGER = 9007199254740991;
const reIsUint = /^(?:0|[1-9]\d*)$/;

/**
 * Verifica se `value` é um índice de array-like válido: número (ou string
 * numérica sem zeros à esquerda) não-negativo, inteiro, menor que
 * `length`. Espelha `isIndex` do Lodash.
 *
 * @param value valor a verificar
 * @param length limite superior (padrão `Number.MAX_SAFE_INTEGER`)
 * @returns `true` se `value` for um índice válido
 */
function isIndex(value: unknown, length = MAX_SAFE_INTEGER): boolean {
    const type = typeof value;
    return !!length && (type === 'number' || (type !== 'symbol' && reIsUint.test(String(value)))) && ((value as number) > -1 && (value as number) % 1 === 0 && (value as number) < length);
}

/**
 * Define `value` no `path` de `object`, criando estruturas intermediárias
 * conforme necessário. Ao criar uma estrutura intermediária nova, escolhe
 * **array** se o próximo segmento do caminho for um índice válido, ou
 * objeto plano caso contrário — isso é o que permite `zipObjectDeep`
 * reconstruir arrays a partir de caminhos como `'a[0].b'`.
 * Auxiliar interno usado por `zipObjectDeep` — espelha `baseSet` do
 * Lodash. Não é exportado no barrel da categoria.
 *
 * @param object objeto raiz a modificar (mutado in-place)
 * @param path caminho onde definir o valor
 * @param value valor a atribuir
 * @returns o próprio `object`
 */
export function deepSet<T extends object>(object: T, path: unknown, value: unknown): T {
    if (object === null || typeof object !== 'object') return object;

    const segments = castPath(path, object, toPath);
    let nested: Record<PropertyKey, unknown> = object as Record<PropertyKey, unknown>;

    for (let index = 0; index < segments.length; index++) {
        const key = segments[index] as PropertyKey;
        if (key === '__proto__' || key === 'constructor' || key === 'prototype') return object;

        if (index !== segments.length - 1) {
            const existing = nested[key];
            if (existing !== null && typeof existing === 'object') nested[key] = existing;
            else nested[key] = isIndex(segments[index + 1]) ? [] : {};

            nested = nested[key] as Record<PropertyKey, unknown>;
        } else nested[key] = value;

    }

    return object;
}
