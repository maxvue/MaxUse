import { reverse } from '../Iterables/reverse';
import { MaxUseWrapper } from './_MaxUseWrapper';

/**
 * Método de instância `.reverse()` do wrapper: versão wrapper de
 * `reverse`, que inverte a ordem dos elementos do array encadeado.
 * **Muta** o array subjacente, assim como o helper `reverse` standalone.
 * Empilha uma ação e retorna um **novo** wrapper. Se o valor encadeado não
 * for um array (`null`, `undefined`, número, objeto etc.), devolve o
 * próprio valor sem lançar — mesmo comportamento do `_.reverse` do Lodash
 * para tipos que não suportam `Array#reverse`.
 * Semelhante ao _.prototype.reverse (wrapperReverse) do Lodash.
 *
 * @returns novo wrapper com a ação empilhada
 */
MaxUseWrapper.prototype.reverse = function (this: MaxUseWrapper<unknown>): MaxUseWrapper<unknown> {
    return this._pushAction((value) => (Array.isArray(value) ? reverse(value) : value));
};

declare module './_MaxUseWrapper' {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars -- T é exigido pela declaração original de MaxUseWrapper<T>, mesmo sem uso direto neste método
    interface MaxUseWrapper<T> {
        reverse(): MaxUseWrapper<unknown>;
    }
}

/**
 * Versão funcional de `.reverse()`, usada como implementação de base pelo
 * futuro alias, e exportada para satisfazer o registro no barrel da
 * categoria (export plano + entrada no objeto namespace). Recebe o
 * wrapper explicitamente em vez de depender de `this`, mais idiomático ao
 * restante da biblioteca.
 *
 * @param wrapper instância de wrapper a inverter
 * @returns novo wrapper com a ação empilhada
 */
export function wrapperReverse(wrapper: MaxUseWrapper<unknown>): MaxUseWrapper<unknown> {
    return wrapper.reverse();
}
