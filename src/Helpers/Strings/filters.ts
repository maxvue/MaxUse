import { toValue, type MaybeRefOrGetter } from 'vue';
import { isBlank } from '../Types/isBlank';

type RefString = MaybeRefOrGetter<string | number | null | undefined>;

/**
 * Filtra uma string, mantendo apenas letras (e opcionalmente espaços).
 *
 * @param value O valor a ser filtrado.
 * @param space Se verdadeiro, mantém os espaços na string retornada.
 * @returns A string contendo apenas letras.
 */
export function onlyLetters(value: RefString, space: boolean = false): string {
    const data = toValue(value);
    if (isBlank(data)) return '';

    return space ? String(data).replace(/[^\p{L}\s]/gu, '') : String(data).replace(/[^\p{L}]/gu, '');
}

/**
 * Filtra uma string, mantendo apenas números (e opcionalmente espaços).
 *
 * @param value O valor a ser filtrado.
 * @param space Se verdadeiro, mantém os espaços na string retornada.
 * @returns A string contendo apenas números.
 */
export function onlyNumbers(value: RefString, space: boolean = false): string {
    const data = toValue(value);
    if (isBlank(data)) return '';
    return space ? String(data).replace(/[^0-9\s]/g, '') : String(data).replace(/[^0-9]/g, '');
}

/**
 * Filtra uma string, mantendo apenas símbolos (caracteres não alfanuméricos).
 *
 * @param value O valor a ser filtrado.
 * @returns A string contendo apenas símbolos.
 */
export function onlySymbols(value: RefString): string {
    const data = toValue(value);
    if (isBlank(data)) return '';
    return String(data).replace(/[^\W_]/g, '');
}

/**
 * Filtra uma string, mantendo apenas letras e números (e opcionalmente espaços).
 *
 * @param value O valor a ser filtrado.
 * @param space Se verdadeiro, mantém os espaços na string retornada.
 * @returns A string contendo apenas letras e números.
 */
export function onlyLettersAndNumbers(value: RefString, space: boolean = false): string {
    const data = toValue(value);
    if (isBlank(data)) return '';
    return space ? String(data).replace(/[^\p{L}0-9\s]/gu, '') : String(data).replace(/[^\p{L}0-9]/gu, '');
}

/**
 * Remove todos os espaços de uma string.
 *
 * @param value O valor a ser processado.
 * @returns A string sem nenhum espaço.
 */
export function removeSpaces(value: RefString): string {
    const data = toValue(value);
    if (isBlank(data)) return '';
    return String(data).replace(/\s+/g, '');
}
