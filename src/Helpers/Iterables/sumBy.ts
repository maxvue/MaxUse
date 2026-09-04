import { toValue, type MaybeRefOrGetter } from 'vue';

type T = Record<string, any>;

/**
 * Soma **coercitivamente** os valores de uma propriedade específica em uma
 * coleção de objetos.
 *
 * Cada valor passa por `Number(valor) || 0`: o que não for numérico
 * (`NaN`, `undefined`, strings não numéricas, objetos) conta como `0`.
 * `null` e `''` já convertem para `0` por `Number`, então o `||` só altera o
 * resultado nos casos `NaN` e `-0`. Aceita array, `Record` e ref/getter.
 *
 * > **Divergência deliberada em relação ao `_.sumBy` do Lodash**, que propaga
 * > `NaN` e concatena strings. Ex.: `sumBy([{ a: 'x' }, { a: 2 }], 'a')` → `2`
 * > (Lodash: `'x2'`). O fallback `0` é o contrato desta biblioteca, pensado
 * > para dados sujos vindos de API/formulário.
 *
 * @param collection A coleção de objetos.
 * @param key A chave que contém o valor numérico a ser somado.
 * @returns A soma total dos valores da chave especificada. Nunca retorna `NaN`.
 */
export function sumBy(collection: MaybeRefOrGetter<T[] | Record<string, T> | null | undefined>, key: keyof T): number {
    const data = toValue(collection);

    if (!data || typeof data !== 'object') return 0;

    const items = Array.isArray(data) ? data : Object.values(data);

    return items.reduce((acc, item) => acc + (Number(item[key]) || 0), 0);
}
