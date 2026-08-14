import { toValue, type MaybeRefOrGetter } from 'vue';
import { isIterateeCall } from './_isIterateeCall';

/**
 * Converte um valor para número finito — coerção interna equivalente ao
 * `toFinite` do Lodash.
 *
 * @param value valor a converter
 * @returns número finito resultante
 */
function toFiniteNumber(value: unknown): number {
    if (!value) return value === 0 ? (value as number) : 0;
    const num = Number(value);
    if (num === Infinity || num === -Infinity) return num < 0 ? -1.7976931348623157e+308 : 1.7976931348623157e+308;
    return num === num ? num : 0;
}

/**
 * Gera um número pseudoaleatório entre `lower` e `upper` (inclusivos).
 * Sem argumentos, retorna um número entre `0` e `1`. Se `upper` for
 * omitido, `lower` vira o limite superior e o limite inferior vira `0`. Se
 * `floating` for `true`, ou se `lower`/`upper` tiverem casas decimais, o
 * resultado é um número de ponto flutuante; caso contrário, um inteiro.
 * Semelhante ao _.random do Lodash.
 *
 * Assim como no Lodash, a função é segura quando passada diretamente como
 * iteratee de `Array.prototype.map` — `[4, 8].map(random)` ignora o índice e o
 * array recebidos como 2º e 3º argumentos, comportando-se como `random(4)` e
 * `random(8)`.
 *
 * @param lower limite inferior, ou limite superior se os demais forem omitidos
 * @param upper limite superior, ou a flag `floating` se for booleano
 * @param floating força o resultado a ser um número de ponto flutuante
 * @returns número pseudoaleatório no intervalo
 */
export function random(lower?: MaybeRefOrGetter<number | boolean>, upper?: MaybeRefOrGetter<number | boolean>, floating?: MaybeRefOrGetter<boolean>): number {
    let lo: unknown = lower === undefined ? undefined : toValue(lower);
    let hi: unknown = upper === undefined ? undefined : toValue(upper);
    let isFloat: unknown = floating === undefined ? undefined : toValue(floating);

    if (isFloat && typeof isFloat !== 'boolean' && isIterateeCall(lo, hi, isFloat)) {
        hi = undefined;
        isFloat = undefined;
    }

    if (isFloat === undefined) if (typeof hi === 'boolean') {
        isFloat = hi;
        hi = undefined;
    } else if (typeof lo === 'boolean') {
        isFloat = lo;
        lo = undefined;
    }


    if (lo === undefined && hi === undefined) {
        lo = 0;
        hi = 1;
    } else {
        lo = toFiniteNumber(lo);
        if (hi === undefined) {
            hi = lo;
            lo = 0;
        } else hi = toFiniteNumber(hi);

    }

    if ((lo as number) > (hi as number)) {
        const temp = lo;
        lo = hi;
        hi = temp;
    }

    if (isFloat || (lo as number) % 1 || (hi as number) % 1) {
        const rand = Math.random();
        const rangeStr = String(rand).length - 1;
        return Math.min((lo as number) + rand * ((hi as number) - (lo as number) + Number(`1e-${rangeStr}`)), hi as number);
    }

    return (lo as number) + Math.floor(Math.random() * ((hi as number) - (lo as number) + 1));
}
