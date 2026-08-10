import { ulid as ulidLib } from 'ulid';
import { toValue, type MaybeRefOrGetter } from 'vue';

function getUlid(): string {
    return String(ulidLib()).toLowerCase();
}

export type Typecode = 'lower' | 'upper' | 'ulid' | 'number' | 'letter' | 'nonumber' | (string & {});

/**
 * Gera uma string aleatória.
 *
 * @param arg1 Comprimento ou código de tipo.
 * @param arg2 Comprimento ou código de tipo.
 * @returns Retorna a string gerada.
 */
export function Random(arg1: MaybeRefOrGetter<number | Typecode> = 20, arg2: MaybeRefOrGetter<number | Typecode> = 'letter lower'): string {
    const val1 = toValue(arg1);
    const val2 = toValue(arg2);

    if (String(val1).includes('ulid') || String(val2).includes('ulid')) return getUlid();

    const length = typeof val1 === 'number' ? val1 : (typeof val2 === 'number' ? val2 : 20);
    const type_code = String(typeof val1 === 'string' ? val1 : String(val2)).toLowerCase();

    let chars = '';

    if (type_code.includes('lower') || type_code.includes('letter')) chars += 'abcdefghijklmnopqrstuvwxyz';
    if (type_code.includes('upper')) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (type_code.includes('number') && !type_code.includes('nonumber')) chars += '0123456789';

    // Fallback se nada foi especificado ou se resultou em vazio
    if (!chars) chars = 'abcdefghijklmnopqrstuvwxyz0123456789';

    // Se for solicitado APENAS número
    if (type_code.includes('number') && !type_code.includes('lower') && !type_code.includes('upper') && !type_code.includes('letter')) chars = '0123456789';

    let result = '';
    const charactersLength = chars.length;

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charactersLength);
        result += String(chars.charAt(randomIndex));
    }

    return result;
}

/**
 * Gera um Universally Unique Lexicographically Sortable Identifier (ULID) em letras minúsculas.
 *
 * @returns Retorna o ULID gerado.
 */
export function ulid(): string {
    return getUlid();
}

/**
 * Gera um número aleatório em um intervalo.
 *
 * @param min Valor mínimo.
 * @param max Valor máximo.
 * @returns Retorna o número gerado.
 */
export function intervalRandom(
    min: MaybeRefOrGetter<number> = 0,
    max: MaybeRefOrGetter<number> = 1000
) {
    const valMin = Math.ceil(toValue(min));
    const valMax = Math.floor(toValue(max));

    return Math.floor(Math.random() * (valMax - valMin + 1)) + valMin;
}
