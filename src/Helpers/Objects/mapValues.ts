import { toValue, type MaybeRefOrGetter } from 'vue';

/**
 * Cria um novo objeto transformando apenas os valores, mas mantendo as chaves originais.
 *
 * Tolerante a `null`/`undefined`: nesses casos devolve um objeto vazio,
 * seguindo o mesmo contrato do `_.mapValues` do Lodash.
 *
 * @param obj O objeto original.
 * @param fn A função de transformação que recebe (valor, chave, objeto).
 * @returns Um novo objeto com os valores transformados.
 */
export function mapValues<T extends object, V>(
    obj: MaybeRefOrGetter<T | null | undefined>,
    fn: (value: T[keyof T], key: keyof T, object: T) => V
): { [K in keyof T]: V } {
    const data = toValue(obj);
    const result = {} as { [K in keyof T]: V };

    if (data == null) return result;

    Object.keys(data).forEach((key) => {
        const k = key as keyof T;
        result[k] = fn(data[k], k, data);
    });

    return result;
}
