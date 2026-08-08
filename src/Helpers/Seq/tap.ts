import { toValue, type MaybeRefOrGetter } from 'vue';
import { MaxUseWrapper } from './_MaxUseWrapper';

/**
 * Invoca `interceptor` com `value` como argumento, para efeito colateral, e retorna `value`.
 * Semelhante ao _.tap do Lodash.
 *
 * @param value valor a repassar ao interceptor e a retornar
 * @param interceptor função invocada com `value`
 * @returns o próprio `value`
 */
export function tap<T>(value: MaybeRefOrGetter<T>, interceptor: (value: T) => void): T {
    const data = toValue(value);
    interceptor(data);
    return data;
}

/**
 * Método de instância `.tap()` do wrapper de encadeamento: empilha uma
 * ação que invoca `interceptor` com o valor corrente da cadeia, para
 * efeito colateral, e repassa o **mesmo** valor adiante (diferente de
 * `.thru()`, que repassa o retorno do interceptor). Assim como as demais
 * ações, só é executada quando `.value()` é chamado (avaliação
 * preguiçosa). Retorna um **novo** wrapper encadeável.
 * Semelhante ao _.prototype.tap do Lodash.
 *
 * @param interceptor função invocada com o valor corrente da cadeia
 * @returns novo wrapper com a ação empilhada
 */
MaxUseWrapper.prototype.tap = function (this: MaxUseWrapper<unknown>, interceptor: (value: unknown) => void): MaxUseWrapper<unknown> {
    return this._pushAction((value) => {
        interceptor(value);
        return value;
    });
};

declare module './_MaxUseWrapper' {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars -- T é exigido pela declaração original de MaxUseWrapper<T>, mesmo sem uso direto neste método
    interface MaxUseWrapper<T> {
        tap(interceptor: (value: unknown) => void): MaxUseWrapper<unknown>;
    }
}
