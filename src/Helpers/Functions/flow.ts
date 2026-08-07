/**
 * Cria uma função que invoca a lista de funções (`funcs`) da esquerda
 * para a direita, repassando os argumentos originais apenas para a
 * primeira, e o retorno de cada função como único argumento para a
 * próxima. Aceita as funções como lista variádica ou como um único array.
 * Semelhante ao _.flow do Lodash.
 *
 * @param funcs funções a compor, na ordem de execução
 * @returns nova função composta
 */
export function flow(...funcs: Array<((...args: any[]) => any) | Array<(...args: any[]) => any>>): (...args: any[]) => any {
    const list = funcs.length === 1 && Array.isArray(funcs[0]) ? funcs[0] : (funcs as Array<(...args: any[]) => any>);

    for (const fn of list) if (typeof fn !== 'function') throw new TypeError('Expected a function');


    return function (this: unknown, ...args: any[]): any {
        if (list.length === 0) return args[0];

        let result = list[0].apply(this, args);
        for (let i = 1; i < list.length; i++) result = list[i].call(this, result);

        return result;
    };
}
