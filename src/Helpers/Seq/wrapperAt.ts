import { at } from '../Objects/at';
import { MaxUseWrapper } from './_MaxUseWrapper';

/**
 * Método de instância `.at()` do wrapper de encadeamento: versão wrapper
 * de `at`, que cria um array com os valores do objeto encadeado nos
 * caminhos especificados. Aceita múltiplos caminhos como argumentos
 * separados ou como array. Empilha uma ação e retorna um **novo** wrapper.
 * Semelhante ao _.prototype.at (wrapperAt) do Lodash.
 *
 * @param paths caminho (ou caminhos) das propriedades a obter
 * @returns novo wrapper com a ação empilhada
 */
MaxUseWrapper.prototype.at = function (this: MaxUseWrapper<unknown>, ...paths: Array<string | number | Array<string | number>>): MaxUseWrapper<unknown[]> {
    return this._pushAction((value) => at(value, ...paths)) as unknown as MaxUseWrapper<unknown[]>;
};

declare module './_MaxUseWrapper' {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars -- T é exigido pela declaração original de MaxUseWrapper<T>, mesmo sem uso direto neste método
    interface MaxUseWrapper<T> {
        at(...paths: Array<string | number | Array<string | number>>): MaxUseWrapper<unknown[]>;
    }
}

/**
 * Versão funcional de `.at()`, exportada para satisfazer o registro no
 * barrel da categoria (export plano + entrada no objeto namespace) e para
 * uso idiomático fora do encadeamento de instância.
 *
 * @param wrapper instância de wrapper a consultar
 * @param paths caminho (ou caminhos) das propriedades a obter
 * @returns novo wrapper com a ação empilhada
 */
export function wrapperAt(wrapper: MaxUseWrapper<unknown>, ...paths: Array<string | number | Array<string | number>>): MaxUseWrapper<unknown[]> {
    return wrapper.at(...paths);
}
