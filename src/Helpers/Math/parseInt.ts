import { toValue, type MaybeRefOrGetter } from 'vue';

const reTrimStart = /^\s+/;

/**
 * Converte uma string para inteiro, removendo espaços à esquerda antes de
 * delegar ao `parseInt` nativo. Diferente de `Number.parseInt`, não
 * interpreta prefixo `0` como octal em nenhum ambiente.
 * Semelhante ao _.parseInt do Lodash.
 *
 * @param value string (ou valor coercível) a converter
 * @param radix base numérica (padrão: auto-detecção do `parseInt` nativo)
 * @returns inteiro resultante, ou `NaN` se não for parseável
 */
export function parseInt(value: MaybeRefOrGetter<unknown>, radix: MaybeRefOrGetter<number> = 0): number {
    const data = toValue(value);
    const r = toValue(radix);
    const str = data === null || data === undefined ? '' : String(data);
    return Number.parseInt(str.replace(reTrimStart, ''), r || 0);
}
