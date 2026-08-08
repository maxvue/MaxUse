import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { defaultTo } from './defaultTo';

describe('defaultTo', () => {
    it('retorna o próprio valor quando é válido', () => {
        expect(defaultTo(1, 10)).toBe(1);
        expect(defaultTo(0, 10)).toBe(0);
        expect(defaultTo('', 10)).toBe('');
    });

    it('substitui NaN, null e undefined pelo valor padrão (peculiaridade)', () => {
        expect(defaultTo(NaN, 10)).toBe(10);
        expect(defaultTo(null, 10)).toBe(10);
        expect(defaultTo(undefined, 10)).toBe(10);
    });

    it('funciona com Ref', () => {
        expect(defaultTo(ref(null), ref(10))).toBe(10);
        expect(defaultTo(ref(5), ref(10))).toBe(5);
    });
});
