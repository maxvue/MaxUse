import { toValue, type MaybeRefOrGetter } from 'vue';

/**
 * Calcula a soma **coercitiva** dos valores em uma coleção.
 *
 * Cada item passa por `parseFloat`; o que não resultar em número
 * (`NaN`, `null`, `undefined`, strings não numéricas, objetos) conta como `0`.
 * Strings numéricas são convertidas (`'1'` vira `1`, não concatenação).
 * Aceita array, `Record` (soma `Object.values`) e ref/getter.
 *
 * > **Divergência deliberada em relação ao `_.sum` do Lodash.** O Lodash propaga
 * > `NaN` e concatena strings; aqui o fallback `0` é o contrato, pensado para
 * > dados vindos de API/formulário onde numéricos chegam como string ou nulos.
 * > Ex.: `sum([6, 4, NaN])` → `10` (Lodash: `NaN`); `sum(['1', '2'])` → `3`
 * > (Lodash: `'12'`). Para semântica idêntica ao Lodash, some manualmente.
 *
 * @param collection A coleção para iterar.
 * @returns Retorna a soma. Nunca retorna `NaN`.
 */
export function sum(collection: MaybeRefOrGetter<number[] | any>): number {
    const data = toValue(collection);
    if (!data) return 0;

    const items = Array.isArray(data) ? data : Object.values(data);

    return items.reduce((acc, val) => {
        const num = parseFloat(val);
        return acc + (isNaN(num) ? 0 : num);
    }, 0);
}
