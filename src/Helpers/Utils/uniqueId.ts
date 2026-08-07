import { toValue, type MaybeRefOrGetter } from 'vue';

let idCounter = 0;

/**
 * Gera um ID único, incremental, opcionalmente prefixado.
 *
 * Peculiaridade: o contador é global e compartilhado entre todas as
 * chamadas do módulo — não reinicia por escopo/instância.
 * Semelhante ao _.uniqueId do Lodash.
 *
 * @param prefix prefixo opcional a anexar antes do número
 * @returns string com o ID único
 */
export function uniqueId(prefix?: MaybeRefOrGetter<string | number | null | undefined>): string {
    const data = toValue(prefix);
    idCounter += 1;
    const prefixStr = data === null || data === undefined ? '' : String(data);
    return prefixStr + idCounter;
}
