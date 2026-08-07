import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { findLastKey } from './findLastKey';

describe('findLastKey', () => {
    it('retorna a chave do último valor que casa com o predicado', () => {
        expect(findLastKey({ a: 1, b: 2, c: 3 }, (v: number) => v > 1)).toBe('c');
    });

    it('retorna undefined quando nenhum valor casa', () => {
        expect(findLastKey({ a: 1 }, (v: number) => v > 10)).toBeUndefined();
    });

    it('retorna undefined para objeto null ou undefined', () => {
        expect(findLastKey(null, () => true)).toBeUndefined();
    });

    it('funciona com Ref', () => {
        expect(findLastKey(ref({ a: 1, b: 2 }), (v: number) => v > 0)).toBe('b');
    });
});
