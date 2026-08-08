import { toValue, type MaybeRefOrGetter } from 'vue';

/**
 * Verifica se o valor é `NaN`. Diferente do `isNaN` global, primeiro
 * confirma que o valor é do tipo `number` — não coage strings nem outros
 * tipos antes de testar. A função de mesmo nome própria da MaxUse
 * (`isNumber`) tem semântica diferente (valida "é numérico"), então este
 * helper não a reutiliza.
 * Semelhante ao _.isNaN do Lodash.
 *
 * @param value valor a verificar
 * @returns `true` se o valor for um número `NaN`
 */
export function isNaN(value: MaybeRefOrGetter<unknown>): boolean {
    const data = toValue(value);
    const isNumberType = typeof data === 'number' || (data !== null && typeof data === 'object' && Object.prototype.toString.call(data) === '[object Number]');
    return isNumberType && Number.isNaN(Number(data));
}
