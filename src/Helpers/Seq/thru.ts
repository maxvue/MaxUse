import { toValue, type MaybeRefOrGetter } from 'vue';
import { MaxUseWrapper } from './_MaxUseWrapper';

/**
 * Invoca `interceptor` com `value` e retorna o **resultado** do
 * interceptor (diferente de `tap`, que retorna o próprio `value`). Serve
 * para "passar" um valor por uma transformação dentro de uma sequência.
 * Semelhante ao _.thru do Lodash.
 *
 * @param value valor a repassar ao interceptor
 * @param interceptor função invocada com `value`; seu retorno é o resultado
 * @returns o retorno de `interceptor`
 */
export function thru<T, R>(value: MaybeRefOrGetter<T>, interceptor: (value: T) => R): R {
    const data = toValue(value);
    return interceptor(data);
}

/**
 * Método de instância `.thru()` do wrapper de encadeamento: empilha uma
 * ação que aplica `interceptor` sobre o resultado corrente e retorna um
 * **novo** wrapper (encadeável), ao contrário da função `thru()` standalone
 * acima, que retorna o resultado bruto do interceptor.
 *
 * @param interceptor função invocada com o valor corrente da cadeia
 * @returns novo wrapper com a ação empilhada
 */
MaxUseWrapper.prototype.thru = function <T, R> (this: MaxUseWrapper<T>, interceptor: (value: T) => R): MaxUseWrapper<R> {
    return this._pushAction((value) => interceptor(value as T)) as unknown as MaxUseWrapper<R>;
};

declare module './_MaxUseWrapper' {
    interface MaxUseWrapper<T> {
        thru<R>(interceptor: (value: T) => R): MaxUseWrapper<R>;
    }
}
