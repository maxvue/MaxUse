import { toValue, type MaybeRefOrGetter } from 'vue';

/**
 * Reduz `collection` (array ou objeto) a um único valor, invocando
 * `iterateeFn` para cada elemento com o acumulador corrente. Se
 * `accumulator` não for informado, o primeiro elemento (ou valor) vira o
 * acumulador inicial e a iteração começa a partir do segundo.
 * Semelhante ao _.reduce do Lodash.
 *
 * @param collection array ou objeto a reduzir
 * @param iterateeFn função `(acc, value, key, collection) => novoAcc`
 * @param accumulator valor inicial do acumulador (opcional)
 * @returns o valor acumulado final
 */
export function reduce<T, R = T>(collection: MaybeRefOrGetter<T[] | Record<string, T> | null | undefined>, iterateeFn: (acc: R, value: T, key: number | string, collection: unknown) => R, accumulator?: R): R | undefined {
    const data = toValue(collection);
    if (data == null) return accumulator;

    const hasInitial = accumulator !== undefined;
    let acc = accumulator as R;

    if (Array.isArray(data)) {
        let started = hasInitial;
        for (let index = 0; index < data.length; index++) {
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
    let started = hasInitial;
    for (const key of objKeys) {
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
