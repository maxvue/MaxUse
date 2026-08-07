import { toValue, type MaybeRefOrGetter } from 'vue';

/**
 * Verifica se o valor é um `Buffer` do Node.js.
 * Semelhante ao _.isBuffer do Lodash.
 *
 * A MaxUse é uma biblioteca voltada a navegador, sem dependência de `Buffer`
 * do Node — assim como o build ESM (`lodash-es`) do próprio Lodash usado
 * como oráculo nesta migração, que também sempre retorna `false` aqui por
 * não referenciar `Buffer` global.
 *
 * @param value valor a verificar
 * @returns sempre `false` neste ambiente
 */
export function isBuffer(value: MaybeRefOrGetter<unknown>): boolean {
    toValue(value);
    return false;
}
