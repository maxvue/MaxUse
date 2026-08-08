import { toValue, type MaybeRefOrGetter } from 'vue';

/**
 * Como `reduce`, mas percorre `collection` (array ou objeto) na ordem
 * inversa: do último elemento para o primeiro (arrays) ou das últimas
 * chaves para as primeiras (objetos, na ordem de `Object.keys` invertida).
 * Semelhante ao _.reduceRight do Lodash.
 *
 * @param collection array ou objeto a reduzir
 * @param iterateeFn função `(acc, value, key, collection) => novoAcc`
 * @param accumulator valor inicial do acumulador (opcional)
 * @returns o valor acumulado final
 */
export function reduceRight<T, R = T>(collection: MaybeRefOrGetter<T[] | Record<string, T> | null | undefined>, iterateeFn: (acc: R, value: T, key: number | string, collection: unknown) => R, accumulator?: R): R | undefined {
    const data = toValue(collection);
    if (data == null) return accumulator;

    const hasInitial = accumulator !== undefined;
    let acc = accumulator as R;
    let started = hasInitial;

    if (Array.isArray(data)) {
        for (let index = data.length - 1; index >= 0; index--) {
            if (!started) {
                acc = data[index] as unknown as R;
                started = true;
                continue;
            }
            acc = iterateeFn(acc, data[index], index, data);
        }
        return started ? acc : undefined;
    }

    const objKeys = Object.keys(data);
    for (let i = objKeys.length - 1; i >= 0; i--) {
        const key = objKeys[i];
        const value = (data as Record<string, T>)[key];
        if (!started) {
            acc = value as unknown as R;
            started = true;
            continue;
        }
        acc = iterateeFn(acc, value, key, data);
    }
    return started ? acc : undefined;
}
