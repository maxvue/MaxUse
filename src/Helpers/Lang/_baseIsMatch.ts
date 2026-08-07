/**
 * Implementação interna compartilhada por `isMatch` e `isMatchWith`. Não é
 * exportada no barrel da categoria — é um detalhe de implementação, não um
 * helper público do manifesto de migração.
 */

type MatchCustomizer = (objValue: unknown, srcValue: unknown, key: string | symbol, object: unknown, source: unknown) => boolean | undefined;

/**
 * Compara dois valores usando SameValueZero (`===`, mas `NaN` é igual a
 * `NaN`).
 *
 * @param a primeiro valor
 * @param b segundo valor
 * @returns `true` se os valores forem equivalentes
 */
function sameValueZero(a: unknown, b: unknown): boolean {
    return a === b || (a !== a && b !== b);
}

/**
 * Compara um par de valores decidindo, na ordem: `customizer` (se definido
 * e retornar algo diferente de `undefined`), correspondência parcial
 * recursiva (se `srcValue` for objeto) ou SameValueZero.
 *
 * @param objValue valor do lado `object`
 * @param srcValue valor do lado `source`
 * @param key chave associada ao par, repassada ao `customizer`
 * @param customizer função opcional para customizar a comparação
 * @returns `true` se os valores casarem
 */
function valuesMatch(objValue: unknown, srcValue: unknown, key: string | symbol, object: unknown, source: unknown, customizer?: MatchCustomizer): boolean {
    if (customizer) {
        const result = customizer(objValue, srcValue, key, object, source);
        if (result !== undefined) return Boolean(result);
    }
    if (Array.isArray(srcValue)) return arraysMatch(objValue, srcValue, customizer);
    if (srcValue !== null && typeof srcValue === 'object') return baseIsMatch(objValue, srcValue, customizer);
    return sameValueZero(objValue, srcValue);
}

/**
 * Verifica se o array `objValue` contém, para cada elemento de
 * `srcValue`, um elemento correspondente ainda não consumido (casamento
 * guloso de primeira correspondência, sem backtracking — replica o
 * comportamento do Lodash).
 *
 * @param objValue valor do lado `object`
 * @param srcValue array com os elementos exigidos
 * @param customizer função opcional para customizar a comparação
 * @returns `true` se `objValue` for um array que casa parcialmente com `srcValue`
 */
function arraysMatch(objValue: unknown, srcValue: unknown[], customizer?: MatchCustomizer): boolean {
    if (!Array.isArray(objValue) || objValue.length < srcValue.length) return false;
    const used = new Array<boolean>(objValue.length).fill(false);
    for (const srcItem of srcValue) {
        let found = false;
        for (let i = 0; i < objValue.length; i++) {
            if (used[i]) continue;
            if (valuesMatch(objValue[i], srcItem, String(i), objValue, srcValue, customizer)) {
                used[i] = true;
                found = true;
                break;
            }
        }
        if (!found) return false;
    }
    return true;
}

/**
 * Verifica recursivamente se `object` contém, para cada chave presente em
 * `source`, um valor equivalente (comparação parcial: chaves extras em
 * `object` são ignoradas). Se `customizer` for fornecido, ele é consultado
 * para cada par de valores antes da comparação padrão; se retornar algo
 * diferente de `undefined`, esse resultado prevalece.
 *
 * @param object valor a inspecionar
 * @param source valor com as chaves/valores exigidos
 * @param customizer função opcional para customizar a comparação por par de valores
 * @returns `true` se `object` casar parcialmente com `source`
 */
export function baseIsMatch(object: unknown, source: unknown, customizer?: MatchCustomizer): boolean {
    if (object === source) return true;
    if (source === null || typeof source !== 'object') return true;

    const keys = [...Object.keys(source), ...Object.getOwnPropertySymbols(source)];
    if (keys.length === 0) return true;
    if (object === null || object === undefined) return false;

    // Lodash trata primitivos (string, number, boolean, symbol) como objetos
    // envolvidos (`Object(object)`) para permitir indexação por chave.
    const objAsObject: object = typeof object === 'object' ? object : Object(object);

    for (const key of keys) {
        const srcValue = (source as Record<string | symbol, unknown>)[key];
        const objValue = (objAsObject as Record<string | symbol, unknown>)[key];

        if (customizer) {
            const result = customizer(objValue, srcValue, key, objAsObject, source);
            if (result !== undefined) {
                if (!result) return false;
                continue;
            }
        }

        if (objValue === undefined && !(key in objAsObject)) return false;

        if (Array.isArray(srcValue)) {
            if (!arraysMatch(objValue, srcValue, customizer)) return false;
        } else if (srcValue !== null && typeof srcValue === 'object') {
            if (!baseIsMatch(objValue, srcValue, customizer)) return false;
        } else if (!sameValueZero(objValue, srcValue)) return false;

    }
    return true;
}
