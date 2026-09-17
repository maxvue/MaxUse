import { toValue, type MaybeRefOrGetter } from 'vue';
import { iteratee } from '../Utils/iteratee';

export type SumByIteratee<T = any> =
    | ((item: T, keyOrIndex?: any, collection?: any) => unknown)
    | PropertyKey
    | [PropertyKey, unknown]
    | Record<string, any>;

/**
 * Soma **coercitivamente** os valores de uma propriedade específica (inclusive
 * aninhada/profunda com notação de ponto) ou derivados por uma função iteratee
 * em uma coleção de objetos.
 *
 * Cada valor passa por `Number(valor) || 0`: o que não for numérico
 * (`NaN`, `undefined`, strings não numéricas, objetos) conta como `0`.
 * `null` e `''` já convertem para `0` por `Number`, então o `||` só altera o
 * resultado nos casos `NaN` e `-0`. Aceita array, `Record` e ref/getter.
 *
 * Suporta caminhos aninhados (ex.: `'data_specs.voc'`), propriedades rasas
 * (ex.: `'v'`) e funções seletoras (ex.: `(item) => item.data_specs.voc`).
 *
 * > **Divergência deliberada em relação ao `_.sumBy` do Lodash**, que propaga
 * > `NaN` e concatena strings. Ex.: `sumBy([{ a: 'x' }, { a: 2 }], 'a')` → `2`
 * > (Lodash: `'x2'`). O fallback `0` é o contrato desta biblioteca, pensado
 * > para dados sujos vindos de API/formulário.
 *
 * @param collection A coleção de objetos (array, Record ou Ref/getter).
 * @param iterateeFn A chave, caminho profundo pontuado ou função iteratee para derivar o valor numérico.
 * @returns A soma total dos valores da chave ou iteratee especificado. Nunca retorna `NaN`.
 */
export function sumBy<T = any>(
    collection: MaybeRefOrGetter<T[] | Record<string, T> | null | undefined>,
    iterateeFn?: SumByIteratee<T> | unknown
): number {
    const data = toValue(collection);

    if (!data || typeof data !== 'object') return 0;

    const items = Array.isArray(data) ? data : Object.values(data);
    const fn = iteratee(iterateeFn);

    return items.reduce((acc, item, index) => acc + (Number(fn(item, index, data)) || 0), 0);
}
