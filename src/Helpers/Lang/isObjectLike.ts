import { unref, type MaybeRef } from 'vue';

/**
 * Verifica se o valor é do tipo `object` e não é `null` (inclui arrays;
 * funções não passam em `typeof === 'object'`, mas todo o resto de tipo
 * referência sim).
 * Semelhante ao _.isObjectLike do Lodash.
 *
 * Usa `unref` em vez de `toValue`: o próprio valor a testar pode ser uma
 * função, e `toValue` a invocaria como getter em vez de preservá-la para o
 * teste `typeof` (o Lodash sempre retorna `false` para função, nunca chama
 * a função para decidir).
 *
 * @param value valor a verificar
 * @returns `true` se o valor for "object-like"
 */
export function isObjectLike(value: MaybeRef<unknown>): boolean {
    const data = unref(value);
    return data !== null && typeof data === 'object';
}
