import { unzipWith } from './unzipWith';

/**
 * Como `zip`, mas aceita `combineFn` para especificar como os valores
 * agrupados devem ser combinados — invocada com os elementos de cada
 * grupo como argumentos separados (`(...group)`). O último argumento é
 * usado como `combineFn` somente se for uma função.
 * Semelhante ao _.zipWith do Lodash.
 *
 * @param arrays arrays a agrupar, seguidos opcionalmente de `combineFn`
 * @returns novo array com os grupos combinados
 */
export function zipWith<T, R = Array<T | undefined>>(...arrays: unknown[]): R[] {
    const last = arrays[arrays.length - 1];
    const combineFn = typeof last === 'function' ? (arrays.pop(), last as (...group: Array<T | undefined>) => R) : undefined;

    return unzipWith(arrays as T[][], combineFn);
}
