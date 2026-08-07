import { unzip } from './unzip';

/**
 * Agrupa os elementos de mesmo índice de vários arrays. É o inverso do
 * `unzip`.
 * Semelhante ao _.zip do Lodash.
 *
 * @param arrays arrays a agrupar
 * @returns novo array com os grupos formados por índice
 */
export function zip<T>(...arrays: T[][]): Array<Array<T | undefined>> {
    return unzip(arrays);
}
