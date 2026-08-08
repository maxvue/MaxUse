import { describe, it, expect } from 'vitest';
import { defaults } from './defaults';

describe('defaults', () => {
    it('preenche apenas propriedades ausentes, na ordem das fontes', () => {
        expect(defaults({ a: 1 }, { a: 2, b: 2 }, { c: 3 })).toEqual({ a: 1, b: 2, c: 3 });
    });

    it('peculiaridade: undefined conta como ausente e é preenchido', () => {
        expect(defaults({ a: undefined }, { a: 1 })).toEqual({ a: 1 });
    });

    it('depois que uma propriedade é definida, fontes seguintes são ignoradas para ela', () => {
        expect(defaults({}, { a: 1 }, { a: 2 })).toEqual({ a: 1 });
    });

    it('trata object null/undefined como um novo objeto vazio', () => {
        expect(defaults(null, { a: 1 })).toEqual({ a: 1 });
    });
});
