import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { isMatch } from './isMatch';

describe('isMatch', () => {
    it('retorna true quando object contém as chaves/valores de source', () => {
        expect(isMatch({ a: 1, b: 2 }, { a: 1 })).toBe(true);
        expect(isMatch({ a: 1, b: 2 }, { a: 2 })).toBe(false);
    });

    it('faz comparação parcial profunda em objetos aninhados (peculiaridade)', () => {
        expect(isMatch({ a: { b: 2, c: 3 } }, { a: { b: 2 } })).toBe(true);
        expect(isMatch({ a: { b: 2 } }, { a: { b: 3 } })).toBe(false);
    });

    it('retorna true quando source é vazio, mesmo que object não seja objeto', () => {
        expect(isMatch({ a: 1 }, {})).toBe(true);
        expect(isMatch(5, {})).toBe(true);
        expect(isMatch(null, {})).toBe(true);
    });

    it('retorna false quando object não tem uma chave exigida por source', () => {
        expect(isMatch({}, { a: undefined })).toBe(false);
        expect(isMatch(null, { a: 1 })).toBe(false);
    });

    it('trata NaN como equivalente a NaN (SameValueZero)', () => {
        expect(isMatch({ a: NaN }, { a: NaN })).toBe(true);
    });

    it('funciona com Ref', () => {
        expect(isMatch(ref({ a: 1, b: 2 }), ref({ a: 1 }))).toBe(true);
        expect(isMatch(ref({ a: 1 }), ref({ a: 2 }))).toBe(false);
    });

    it('casa arrays por subconjunto não-ordenado, sem exigir os mesmos índices (peculiaridade)', () => {
        expect(isMatch({ a: [1, 2] }, { a: [2] })).toBe(true);
        expect(isMatch({ a: [1, 2] }, { a: [2, 1] })).toBe(true);
        expect(isMatch({ a: [1, 2] }, { a: [3] })).toBe(false);
        expect(isMatch({ a: [1, 2] }, { a: [1, 1] })).toBe(false);
        expect(isMatch({ a: [1, 1, 2] }, { a: [1, 2] })).toBe(true);
    });

    it('trata primitivos não-nulos como objetos indexáveis (peculiaridade)', () => {
        expect(isMatch('abc', { 0: 'a' })).toBe(true);
        expect(isMatch('abc', { 0: 'z' })).toBe(false);
        expect(isMatch(5, { toFixed: Number.prototype.toFixed })).toBe(true);
    });

    it('trata source primitivo não-nulo como objeto indexável, não como "sem restrições" (peculiaridade)', () => {
        expect(isMatch('abc', 'abd')).toBe(false);
        expect(isMatch('abc', 'abc')).toBe(true);
        expect(isMatch('x', [{ a: 1 }])).toBe(false);
    });
});
