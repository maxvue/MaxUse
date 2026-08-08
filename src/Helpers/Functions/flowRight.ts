import { flow } from './flow';

/**
 * Como `flow`, mas invoca as funções da direita para a esquerda.
 * Semelhante ao _.flowRight do Lodash.
 *
 * @param funcs funções a compor, na ordem inversa de execução
 * @returns nova função composta
 */
export function flowRight(...funcs: Array<((...args: any[]) => any) | Array<(...args: any[]) => any>>): (...args: any[]) => any {
    const list = funcs.length === 1 && Array.isArray(funcs[0]) ? funcs[0] : (funcs as Array<(...args: any[]) => any>);
    return flow(list.slice().reverse());
}
