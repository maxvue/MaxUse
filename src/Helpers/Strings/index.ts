export * from './random';
export * from './masks';
export * from './filters';
export * from './cases';
export * from './converters';
export * from './manipulations';
export * from './toLower';
export * from './toUpper';
export * from './trim';
export * from './trimStart';
export * from './trimEnd';
export * from './startsWith';
export * from './endsWith';
export * from './escape';
export * from './unescape';
export * from './escapeRegExp';
export * from './deburr';
export * from './words';
export * from './split';
export * from './replace';
export * from './lowerFirst';
export * from './upperFirst';
export * from './pad';
export * from './padStart';
export * from './padEnd';
export * from './repeat';
export * from './lowerCase';
export * from './upperCase';
export * from './startCase';

import { Random, ulid, intervalRandom } from './random';
import { truncate, slugify, stripHtml, initials, readingTime } from './manipulations';
import { onlyLetters, onlyNumbers, onlySymbols, onlyLettersAndNumbers, removeSpaces } from './filters';
import { snakeCase, kebabCase, camelCase, capitalize } from './cases';

export { stripHtml as noHtml };

export const Str = {
    Random,
    code: Random,
    ulid,
    intervalRandom,
    interval: intervalRandom,
    truncate,
    slugify,
    capitalize,
    noHtml: stripHtml,
    initials,
    readingTime
};

export const StrFilter = {
    onlyLetters,
    onlyNumbers,
    onlyLettersAndNumbers,
    onlySymbols,
    removeSpaces
};

export const StrCase = {
    snakeCase,
    kebabCase,
    camelCase,
    capitalize
};

