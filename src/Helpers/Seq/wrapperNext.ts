import { MaxUseWrapper } from './_MaxUseWrapper';
import { isArrayLike } from '../Lang/isArrayLike';

/**
 * Método de instância `.next()` do wrapper: obtém o próximo valor seguindo
 * o protocolo de iterador. Na primeira chamada, resolve `.value()` e
 * converte o resultado para array — arrays, strings e demais valores
 * "array-like" (têm `length` numérico válido, ex.: `arguments`, objetos
 * `{ 0: 'a', length: 1 }`) são lidos por índice até `length`, iteráveis
 * (`Set`, `Map`, etc.) via `Array.from`, e objetos planos via
 * `Object.values`. Chamadas seguintes avançam um índice interno.
 * Semelhante ao _.prototype.next (wrapperNext) do Lodash.
 *
 * @returns objeto `{ done, value }` do protocolo de iterador
 */
MaxUseWrapper.prototype.next = function (this: MaxUseWrapper<unknown>): { done: boolean; value: unknown } {
    if (this.__values__ === undefined) {
        const resolved = this.value();
        if (typeof resolved === 'string' || isArrayLike(resolved)) {
            const length = (resolved as ArrayLike<unknown>).length;
            this.__values__ = Array.from({ length }, (_, i) => (resolved as ArrayLike<unknown>)[i]);
        } else if (resolved != null && typeof (resolved as Iterable<unknown>)[Symbol.iterator] === 'function') this.__values__ = Array.from(resolved as Iterable<unknown>);
        else if (resolved != null && typeof resolved === 'object') this.__values__ = Object.values(resolved as object);
        else this.__values__ = [];
    }
    const done = this.__index__ >= this.__values__.length;
    const value = done ? undefined : this.__values__[this.__index__++];
    return { done, value };
};

declare module './_MaxUseWrapper' {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars -- T é exigido pela declaração original de MaxUseWrapper<T>, mesmo sem uso direto neste método
    interface MaxUseWrapper<T> {
        next(): { done: boolean; value: unknown };
    }
}

/**
 * Versão funcional de `.next()`, usada como implementação de base pelo
 * alias `next` (`next.ts`). Recebe o wrapper explicitamente em vez de
 * depender de `this`, mais idiomático ao restante da biblioteca.
 *
 * @param wrapper instância de wrapper a avançar
 * @returns objeto `{ done, value }` do protocolo de iterador
 */
export function wrapperNext<T>(wrapper: MaxUseWrapper<T>): { done: boolean; value: unknown } {
    return wrapper.next();
}
