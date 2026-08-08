import { toValue, type MaybeRefOrGetter } from 'vue';
import { baseIsMatch } from '../Lang/_baseIsMatch';
import { deepClone } from '../Objects/deepClone';
import { hasIn } from '../Objects/hasIn';
import { baseGet } from './_baseGet';

/**
 * Cria uma função que verifica se o valor no `path` do objeto recebido
 * casa parcialmente com `srcValue` (comparação profunda, por
 * SameValueZero). `srcValue` é clonado profundamente no momento da
 * criação. Quando o caminho resolve para `undefined` e `srcValue` também é
 * `undefined`, o critério muda para "o caminho existe" (`hasIn`), em vez
 * de comparar os dois `undefined` como iguais — replica a peculiaridade do
 * Lodash para esse par de valores.
 * Semelhante ao _.matchesProperty do Lodash.
 *
 * @param path caminho da propriedade a comparar
 * @param srcValue valor exigido nesse caminho
 * @returns função `(object) => boolean`
 */
export function matchesProperty(path: MaybeRefOrGetter<unknown>, srcValue: MaybeRefOrGetter<unknown>): (object: unknown) => boolean {
    const key = toValue(path);
    const src = deepClone(toValue(srcValue));
    return (object: unknown) => {
        const objValue = baseGet(object, key);
        if (objValue === src) return objValue !== undefined || hasIn(object, key);
        // Espelha o guard de `baseIsEqual`: se qualquer lado for `null`/`undefined`
        // (e não forem estritamente iguais, já checado acima), só casam por NaN.
        if (src == null || objValue == null) return Number.isNaN(src) && Number.isNaN(objValue);
        if (typeof src !== 'object') return objValue === src || (Number.isNaN(src) && Number.isNaN(objValue));
        // `baseIsMatch` só faz sentido quando `objValue` também é um objeto —
        // um objValue primitivo (ex.: número) nunca casa parcialmente com um
        // `src` objeto, mesmo que `src` não tenha chaves. Da mesma forma, um
        // array nunca casa com um objeto plano (tags diferentes), mesmo com
        // `src` sem chaves.
        if (typeof objValue !== 'object' || Array.isArray(objValue) !== Array.isArray(src)) return false;
        return baseIsMatch(objValue, src);
    };
}
