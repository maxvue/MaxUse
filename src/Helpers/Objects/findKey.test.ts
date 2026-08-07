import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { findKey } from './findKey';

describe('findKey', () => {
    it('retorna a chave do primeiro valor que casa com o predicado', () => {
        expect(findKey({ a: 1, b: 2, c: 3 }, (v: number) => v > 1)).toBe('b');
    });

    it('peculiaridade: objeto como predicado vira matches via iteratee', () => {
        expect(findKey({ a: { x: 1 }, b: { x: 2 } }, { x: 2 })).toBe('b');
    });

    it('retorna undefined quando nenhum valor casa', () => {
        expect(findKey({ a: 1 }, (v: number) => v > 10)).toBeUndefined();
    });

    it('retorna undefined para objeto null ou undefined', () => {
        expect(findKey(null, () => true)).toBeUndefined();
    });

    it('funciona com Ref', () => {
        expect(findKey(ref({ a: 1, b: 2 }), (v: number) => v === 2)).toBe('b');
    });
});
