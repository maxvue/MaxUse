import { MaxUseWrapper } from './_MaxUseWrapper';

/**
 * Método de instância `.commit()` do wrapper: executa a fila de ações
 * pendentes e retorna um **novo** wrapper cujo `__wrapped__` já é o valor
 * resolvido, com `__actions__` vazio. Semelhante ao
 * _.prototype.commit (wrapperCommit) do Lodash.
 *
 * @returns novo wrapper com o valor resolvido e sem ações pendentes
 */
MaxUseWrapper.prototype.commit = function (this: MaxUseWrapper<unknown>): MaxUseWrapper<unknown> {
    return new MaxUseWrapper(this.value(), this.__chain__);
};

declare module './_MaxUseWrapper' {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars -- T é exigido pela declaração original de MaxUseWrapper<T>, mesmo sem uso direto neste método
    interface MaxUseWrapper<T> {
        commit(): MaxUseWrapper<unknown>;
    }
}

/**
 * Versão funcional de `.commit()`, usada como implementação de base pelo
 * alias `commit` (`commit.ts`). Recebe o wrapper explicitamente em vez de
 * depender de `this`, mais idiomático ao restante da biblioteca.
 *
 * @param wrapper instância de wrapper a resolver e reencapsular
 * @returns novo wrapper com o valor resolvido e sem ações pendentes
 */
export function wrapperCommit<T>(wrapper: MaxUseWrapper<T>): MaxUseWrapper<unknown> {
    return wrapper.commit();
}
