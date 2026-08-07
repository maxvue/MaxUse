import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { nth } from './nth';

describe('nth', () => {
    it('retorna o elemento no índice', () => {
        expect(nth([1, 2, 3], 1)).toBe(2);
    });

    it('índice negativo conta do fim', () => {
        expect(nth([1, 2, 3], -1)).toBe(3);
        expect(nth([1, 2, 3], -2)).toBe(2);
    });

    it('retorna undefined para índice fora do range', () => {
        expect(nth([1, 2, 3], 10)).toBeUndefined();
        expect(nth([1, 2, 3], -10)).toBeUndefined();
    });

    it('usa índice 0 por padrão', () => {
        expect(nth([1, 2, 3])).toBe(1);
    });

    it('retorna undefined para array vazio', () => {
        expect(nth([], 0)).toBeUndefined();
    });

    it('retorna undefined para null', () => {
        expect(nth(null, 0)).toBeUndefined();
    });

    it('trunca índice fracionário', () => {
        expect(nth([1, 2, 3], 1.9)).toBe(2);
    });

    it('funciona com Ref', () => {
        expect(nth(ref([1, 2, 3]), -1)).toBe(3);
    });
});
