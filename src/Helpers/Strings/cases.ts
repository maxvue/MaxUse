import { toValue, type MaybeRefOrGetter } from 'vue';
import { isBlank } from '../Types/isBlank';

type RefString = MaybeRefOrGetter<string | number | null | undefined>;

function normalizeInput(value: unknown): string {
    const data = toValue(value);
    if (!data || isBlank(data)) return '';
    return String(data).normalize('NFD').replace(/\p{Diacritic}/gu, '');
}

/**
 * Converte uma string para o formato snake_case.
 *
 * @param value A string a ser convertida.
 * @returns A string em formato snake_case.
 */
export function snakeCase(value: RefString): string {
    const stringData = normalizeInput(value);
    if (!stringData) return '';

    const words = stringData.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g);
    return words ? words.map((word: string) => word.toLowerCase()).join('_') : '';
}

/**
 * Converte uma string para o formato kebab-case.
 *
 * @param value A string a ser convertida.
 * @returns A string em formato kebab-case.
 */
export function kebabCase(value: RefString): string {
    const stringData = normalizeInput(value);
    if (!stringData) return '';

    const words = stringData.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g);
    return words ? words.map((word: string) => word.toLowerCase()).join('-') : '';
}

/**
 * Converte uma string para o formato camelCase.
 *
 * @param value A string a ser convertida.
 * @returns A string em formato camelCase.
 */
export function camelCase(value: RefString): string {
    const stringData = normalizeInput(value);
    if (!stringData) return '';

    const words = stringData.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g);
    return words ? words.map((word: string, index: number) => {
        if (index === 0) return word.toLowerCase();
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    }).join('') : '';
}

/**
 * Garante que apenas a primeira letra da string seja maiúscula e o restante minúscula.
 *
 * @param value A string a ser formatada.
 */
export function capitalize(value: RefString): string {
    const data = toValue(value);
    if (isBlank(data)) return '';

    const str = String(data);
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
