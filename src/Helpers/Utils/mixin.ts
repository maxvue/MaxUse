export interface MixinOptions {
    chain?: boolean;
}

/**
 * Copia as propriedades de função de `source` para `object`, adicionando
 * cada uma como um novo método de `object`. **Muta `object`** e o
 * retorna. `options.chain` (padrão `true`) não tem efeito na MaxUse —
 * não há wrapper de encadeamento global equivalente ao `_` do Lodash
 * clássico (`window._`) para o qual disparar o método sem argumento
 * explícito de destino.
 * Semelhante ao _.mixin do Lodash.
 *
 * @param object objeto de destino a mutar (recebe os novos métodos)
 * @param source objeto cujas funções serão copiadas para `object`
 * @param options `chain` — mantido apenas por paridade de assinatura
 * @returns o próprio `object`, mutado
 */
export function mixin<T extends object, S extends Record<string, unknown>>(object: T, source: S, options?: MixinOptions): T {
    void options;
    const target = object as Record<string, unknown>;
    for (const key of Object.keys(source)) if (typeof source[key] === 'function') target[key] = source[key];

    return object;
}
