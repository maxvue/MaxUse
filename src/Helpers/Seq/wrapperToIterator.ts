import { MaxUseWrapper } from './_MaxUseWrapper';

/**
 * Torna o wrapper iterável, implementando `Symbol.iterator` de forma a
 * retornar a própria instância (que já expõe `.next()` seguindo o
 * protocolo de iterador — ver `wrapperNext.ts`). Permite usar
 * `Array.from(wrapper)` ou `for...of` sobre um wrapper de encadeamento.
 * Semelhante ao _.prototype[Symbol.iterator] (wrapperToIterator) do
 * Lodash.
 *
 * @returns a própria instância do wrapper
 */
MaxUseWrapper.prototype[Symbol.iterator] = function <T> (this: MaxUseWrapper<T>): MaxUseWrapper<T> {
    return this;
};

declare module './_MaxUseWrapper' {
    interface MaxUseWrapper<T> {
        [Symbol.iterator](): MaxUseWrapper<T>;
    }
}

/**
 * Versão funcional de `[Symbol.iterator]`, usada como implementação de
 * base pelo alias `toIterator` (`toIterator.ts`). Recebe o wrapper
 * explicitamente em vez de depender de `this`.
 *
 * @param wrapper instância de wrapper a tornar iterável
 * @returns a própria instância do wrapper
 */
export function wrapperToIterator<T>(wrapper: MaxUseWrapper<T>): MaxUseWrapper<T> {
    return wrapper[Symbol.iterator]();
}
