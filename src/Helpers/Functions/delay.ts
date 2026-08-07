import { toNumber } from '../Strings/converters';

/**
 * Invoca `func` depois de `wait` milissegundos. Quaisquer argumentos
 * adicionais são repassados para `func` quando ela for invocada.
 * Semelhante ao _.delay do Lodash.
 *
 * @param func função a invocar
 * @param wait milissegundos de espera
 * @param args argumentos repassados para `func`
 * @returns o id do timer (como `setTimeout`)
 */
export function delay<T extends (...args: any[]) => any>(func: T, wait: number, ...args: Parameters<T>): ReturnType<typeof setTimeout> {
    if (typeof func !== 'function') throw new TypeError('Expected a function');
    return setTimeout(() => func(...args), toNumber(wait) || 0);
}
