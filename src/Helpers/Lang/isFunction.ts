import { unref, type MaybeRef } from 'vue';

/**
 * Verifica se o valor é uma função (inclui funções assíncronas, geradoras e proxies de função).
 * Semelhante ao _.isFunction do Lodash.
 *
 * Usa `unref` em vez de `toValue`: o próprio valor a testar pode ser uma
 * função, e `toValue` invocaria essa função como se fosse um getter em vez
 * de preservá-la para o teste `typeof`. `unref` só desembrulha `Ref`,
 * nunca chama funções.
 *
 * @param value valor a verificar
 * @returns `true` se o valor for uma função
 */
export function isFunction(value: MaybeRef<unknown>): boolean {
    const data = unref(value);
    return typeof data === 'function';
}
