import { toValue, type MaybeRefOrGetter } from 'vue';
import { unzip } from './unzip';

/**
 * Como `unzip`, mas aceita `combineFn` para especificar como os grupos
 * transpostos devem ser combinados — invocada com os elementos de cada
 * grupo como argumentos separados (`(...group)`). Sem `combineFn`,
 * comporta-se como `unzip`.
 * Semelhante ao _.unzipWith do Lodash.
 *
 * @param array array de grupos a transpor
 * @param combineFn função que combina os elementos de cada grupo transposto
 * @returns novo array com os grupos combinados
 */
export function unzipWith<T, R = Array<T | undefined>>(array: MaybeRefOrGetter<T[][] | null | undefined>, combineFn?: (...group: Array<T | undefined>) => R): R[] {
    const data = toValue(array);
    if (!data || !data.length) return [];

    const result = unzip(data);
    if (combineFn == null) return result as unknown as R[];

    return result.map((group) => combineFn(...group));
}
