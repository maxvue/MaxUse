import { toValue, type MaybeRefOrGetter } from 'vue';
import { toInteger } from '../Lang/toInteger';
import { isArrayLike } from '../Lang/isArrayLike';

/**
 * Verifica se `value` está presente em `collection`, usando SameValueZero
 * para comparação (com suporte a `NaN`). Aceita array, string ou objeto
 * (nesse caso, verifica os valores próprios enumeráveis).
 * Semelhante ao _.includes do Lodash.
 *
 * @param collection array, string ou objeto a verificar
 * @param value valor a procurar
 * @param fromIndex índice inicial da busca; negativo conta do fim
 * @returns `true` se o valor for encontrado
 */
export function includes<T>(
    collection: MaybeRefOrGetter<T[] | Record<string, T> | string | null | undefined>,
    value: T,
    fromIndex?: number
): boolean {
    const data = toValue(collection);
    if (data == null) return false;

    if (typeof data === 'string') {
        const length = data.length;
        let index = fromIndex ? toInteger(fromIndex) : 0;
        if (index < 0) index = Math.max(length + index, 0);
        return index <= length && data.indexOf(value as unknown as string, index) > -1;
    }

    const items: T[] = isArrayLike(data) ? (data as T[]) : (Object.values(data as Record<string, T>) as T[]);
    const length = items.length;
    if (!length) return false;

    let index = fromIndex ? toInteger(fromIndex) : 0;
    if (index < 0) index = Math.max(length + index, 0);

    const isValueNaN = value !== value;
    for (; index < length; index++) {
        const item = items[index];
        if (item === value || (isValueNaN && item !== item)) return true;
    }

    return false;
}
