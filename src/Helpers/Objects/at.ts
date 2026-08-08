import { toValue, type MaybeRefOrGetter } from 'vue';
import { get } from './get';

/**
 * Cria um array com os valores de `object` nos caminhos especificados.
 * Aceita múltiplos caminhos como argumentos separados ou como array.
 * Semelhante ao _.at do Lodash.
 *
 * @param object objeto a consultar
 * @param paths caminho (ou caminhos) das propriedades a obter
 * @returns array com os valores encontrados, na ordem dos caminhos
 */
export function at<T = unknown>(
    object: MaybeRefOrGetter<unknown>,
    ...paths: Array<string | number | Array<string | number>>
): Array<T | undefined> {
    const data = toValue(object);
    const flatPaths = paths.flat(1).map((path) => String(path));

    return flatPaths.map((path) => (data == null ? undefined : (get(data, path) as T)));
}
