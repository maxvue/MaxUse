/**
 * Atribui `value` a `object[key]`. Quando a chave é `__proto__`, usa
 * `Object.defineProperty` para criar uma propriedade de dados própria e
 * enumerável, em vez de disparar o setter nativo `Object.prototype.__proto__`
 * — que trocaria o protótipo do objeto de destino.
 * Auxiliar interno; espelha `baseAssignValue` do Lodash. Não é exportado no
 * barrel da categoria.
 *
 * @param object objeto de destino (mutado in-place)
 * @param key chave a atribuir
 * @param value valor a atribuir
 */
export function baseAssignValue(object: Record<PropertyKey, unknown>, key: PropertyKey, value: unknown): void {
    if (key === '__proto__') Object.defineProperty(object, key, { configurable: true, enumerable: true, value, writable: true });
    else object[key] = value;
}
