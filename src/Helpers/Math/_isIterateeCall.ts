import { eq } from '../Lang/eq';
import { isArrayLike } from '../Lang/isArrayLike';
import { isObject } from '../Types/isObject';

/** Comprimento máximo de um índice de array válido em JavaScript. */
const MAX_SAFE_INTEGER = 9007199254740991;

/**
 * Verifica se o valor é um índice de array válido — inteiro não negativo
 * menor que `length`. Equivalente ao `isIndex` interno do Lodash.
 *
 * @param value valor a verificar
 * @param length comprimento do objeto array-like
 * @returns `true` se o valor for um índice válido
 */
function isIndex(value: unknown, length: number): boolean {
    const len = length === undefined ? MAX_SAFE_INTEGER : length;
    if (typeof value !== 'number') return false;
    return len > 0 && value > -1 && value % 1 === 0 && value < len;
}

/**
 * Implementação interna compartilhada pelos helpers que precisam tolerar ser
 * usados como iteratee de métodos como `Array.prototype.map`. Não é exportada
 * no barrel da categoria — é um detalhe de implementação, não um helper
 * público.
 *
 * Detecta a assinatura `(value, index|key, object)` recebida quando uma função
 * de aridade variável é passada diretamente para `.map()`/`.forEach()`: nesse
 * caso o 2º e o 3º argumentos não foram informados pelo chamador e devem ser
 * ignorados. Equivalente ao `isIterateeCall` interno do Lodash.
 *
 * @param value valor do 1º argumento (o elemento iterado)
 * @param index valor do 2º argumento (o índice ou a chave)
 * @param object valor do 3º argumento (a coleção iterada)
 * @returns `true` se os argumentos vierem de uma chamada de iteratee
 */
export function isIterateeCall(value: unknown, index: unknown, object: unknown): boolean {
    if (!isObject(object)) return false;

    const type = typeof index;
    if (type === 'number') {
        if (!isArrayLike(object) || !isIndex(index, (object as ArrayLike<unknown>).length)) return false;
    } else if (!(type === 'string' && (index as string) in (object as object))) return false;

    return eq((object as Record<string, unknown>)[index as string], value);
}
