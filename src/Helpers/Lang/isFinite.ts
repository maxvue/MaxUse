import { toValue, type MaybeRefOrGetter } from 'vue';

/**
 * Verifica se o valor é um número primitivo finito. Diferente do `isFinite`
 * global, **não** coage strings numéricas.
 * Semelhante ao _.isFinite do Lodash.
 *
 * @param value valor a verificar
 * @returns `true` se o valor for um número finito
 */
export function isFinite(value: MaybeRefOrGetter<unknown>): boolean {
    const data = toValue(value);
    return typeof data === 'number' && Number.isFinite(data);
}
