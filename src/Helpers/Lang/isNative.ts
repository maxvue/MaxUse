import { unref, type MaybeRef } from 'vue';

// Escapa caracteres especiais de regex para montar o padrão de detecção
// de código nativo a partir de `Function.prototype.toString`.
const reRegExpChar = /[\\^$.*+?()[\]{}|]/g;
const reIsNative = RegExp('^' +
    Function.prototype.toString.call(Object.prototype.hasOwnProperty)
        .replace(reRegExpChar, '\\$&')
        .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/**
 * Verifica se o valor é uma função nativa (implementada pelo motor
 * JavaScript, não escrita em JS puro).
 * Semelhante ao _.isNative do Lodash.
 *
 * Usa `unref` em vez de `toValue`: o valor a testar é a própria função, e
 * `toValue` a invocaria como getter em vez de preservá-la para o teste.
 *
 * Diferente do Lodash original, esta implementação **não lança** em
 * ambientes com `core-js` (polyfills que mascaram funções nativas) — o
 * Lodash faz isso como proteção interna contra falso-positivo; aqui apenas
 * retorna `false` para funções não reconhecidas como nativas.
 *
 * @param value valor a verificar
 * @returns `true` se o valor for uma função nativa
 */
export function isNative(value: MaybeRef<unknown>): boolean {
    const data = unref(value);
    if (typeof data !== 'function') return false;
    return reIsNative.test(Function.prototype.toString.call(data));
}
