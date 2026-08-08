// Reconhece um caminho "raso": só caracteres de palavra (`\w*`), incluindo
// a string vazia. Espelha `reIsPlainProp` do Lodash.
const reIsPlainProp = /^\w*$/;
// Reconhece um caminho "profundo": contém `.` ou `[...]`. Espelha
// `reIsDeepProp` do Lodash.
const reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/;

/**
 * Verifica se `value` deve ser tratado como uma **chave única literal**
 * (não como um caminho a ser dividido em segmentos). Isso acontece quando
 * `value` não é array e é: um tipo primitivo não-string (número, símbolo,
 * booleano, `null`/`undefined`), uma string "rasa" (só `\w*`), uma string
 * que não parece um caminho profundo, ou uma string que já é uma chave
 * própria existente em `object`.
 * Auxiliar interno, não faz parte da migração de 46 helpers da fase 2 —
 * espelha `_isKey` do Lodash, necessário para `has`/`hasIn` reproduzirem o
 * comportamento de fallback em torno de chaves literais incomuns (ex.:
 * string vazia).
 *
 * @param value valor a verificar
 * @param object objeto de referência para checar se `value` já é uma chave própria
 * @returns `true` se `value` deve ser tratado como chave única
 */
function isKey(value: unknown, object: unknown): boolean {
    if (Array.isArray(value)) return false;

    const type = typeof value;
    if (type === 'number' || type === 'symbol' || type === 'boolean' || value == null) return true;

    if (type !== 'string') return false;

    const str = value as string;
    return reIsPlainProp.test(str) || !reIsDeepProp.test(str) || (object != null && str in Object(object));
}

/**
 * Converte `value` em um array de segmentos de caminho, tratando-o como
 * chave única literal quando `isKey` reconhece esse padrão (ex.: string
 * vazia, ou uma string que já é chave própria do objeto), e delegando ao
 * parser genérico (`toPath`) caso contrário.
 * Auxiliar interno espelhando `_castPath` do Lodash.
 *
 * @param value caminho a converter
 * @param object objeto de referência para o fallback de `isKey`
 * @param toPath função de parsing de caminho genérico
 * @returns array de segmentos do caminho
 */
export function castPath(
    value: unknown,
    object: unknown,
    toPath: (v: unknown) => Array<string | symbol>
): Array<string | symbol> {
    if (Array.isArray(value)) return value as Array<string | symbol>;
    if (isKey(value, object)) return [value as string | symbol];
    return toPath(value);
}
