import { delay } from './delay';

/**
 * Adia a invocação de `func` até que a thread atual termine de processar.
 * Quaisquer argumentos adicionais são repassados para `func`.
 * Semelhante ao _.defer do Lodash.
 *
 * @param func função a invocar
 * @param args argumentos repassados para `func`
 * @returns o id do timer (como `setTimeout`)
 */
export function defer<T extends (...args: any[]) => any>(func: T, ...args: Parameters<T>): ReturnType<typeof setTimeout> {
    if (typeof func !== 'function') throw new TypeError('Expected a function');
    return delay(func, 1, ...args);
}
