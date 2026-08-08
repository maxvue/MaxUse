import { MaxUseWrapper } from './_MaxUseWrapper';

/**
 * Método de instância `.chain()` do wrapper: habilita encadeamento
 * explícito sobre um wrapper já existente. **Muta** `__chain__` para
 * `true` na própria instância e retorna `this` — mesmo comportamento
 * observável do Lodash real (`wrapperChain` altera `__chain__` in-place
 * em vez de criar uma cópia).
 * Semelhante ao _.prototype.chain (wrapperChain) do Lodash.
 *
 * @returns a própria instância, com `__chain__` habilitado
 */
MaxUseWrapper.prototype.chain = function (this: MaxUseWrapper<unknown>): MaxUseWrapper<unknown> {
    this.__chain__ = true;
    return this;
};

declare module './_MaxUseWrapper' {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars -- T é exigido pela declaração original de MaxUseWrapper<T>, mesmo sem uso direto neste método
    interface MaxUseWrapper<T> {
        chain(): MaxUseWrapper<unknown>;
    }
}

/**
 * Versão funcional de `.chain()`, exportada para satisfazer o registro no
 * barrel da categoria (export plano + entrada no objeto namespace) e para
 * uso idiomático fora do encadeamento de instância.
 *
 * @param wrapper instância de wrapper a habilitar para encadeamento explícito
 * @returns a própria instância, com `__chain__` habilitado
 */
export function wrapperChain(wrapper: MaxUseWrapper<unknown>): MaxUseWrapper<unknown> {
    return wrapper.chain();
}
