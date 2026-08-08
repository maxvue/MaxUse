import { toValue, type MaybeRefOrGetter } from 'vue';
import { isArrayLike } from '../Lang/isArrayLike';

/**
 * Verifica se `value` é "array-like" **e** um objeto (exclui primitivos
 * como string, que são array-like mas não contam como grupo válido aqui).
 * Espelha `isArrayLikeObject` do Lodash.
 */
function isArrayLikeObject(value: unknown): boolean {
    return typeof value === 'object' && value !== null && isArrayLike(value);
}

/**
 * Transpõe um array de grupos: agrupa o n-ésimo elemento de cada grupo em
 * um novo array. É o inverso do `zip`. Grupos que não são array-like
 * objects (ex.: strings, `null`, primitivos) são ignorados; o comprimento
 * do resultado é o do maior grupo válido.
 * Semelhante ao _.unzip do Lodash.
 *
 * @param array array de arrays (grupos) a transpor
 * @returns novo array transposto
 */
export function unzip<T>(array: MaybeRefOrGetter<T[][] | null | undefined>): Array<Array<T | undefined>> {
    const data = toValue(array);
    if (!data || !data.length) return [];

    let length = 0;
    const groups = data.filter((group) => {
        if (isArrayLikeObject(group)) {
            length = Math.max((group as ArrayLike<T>).length, length);
            return true;
        }
        return false;
    });

    const result: Array<Array<T | undefined>> = [];
    for (let index = 0; index < length; index++) result.push(groups.map((group) => (group as ArrayLike<T>)[index]));


    return result;
}
