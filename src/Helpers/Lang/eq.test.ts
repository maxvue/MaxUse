import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { eq } from './eq';

describe('eq', () => {
    it('retorna true para valores primitivos iguais', () => {
        expect(eq(1, 1)).toBe(true);
        expect(eq('a', 'a')).toBe(true);
    });

    it('retorna true para NaN comparado com NaN (peculiaridade: SameValueZero)', () => {
        expect(eq(NaN, NaN)).toBe(true);
    });

    it('retorna false para objetos diferentes com mesmo conteúdo (identidade, não deep equal)', () => {
        const obj = { a: 1 };
        expect(eq(obj, { a: 1 })).toBe(false);
        expect(eq(obj, obj)).toBe(true);
    });

    it('retorna false para tipos diferentes', () => {
        expect(eq(0, '0')).toBe(false);
        expect(eq(null, undefined)).toBe(false);
    });

    it('funciona com Ref', () => {
        expect(eq(ref(1), ref(1))).toBe(true);
        expect(eq(ref(NaN), NaN)).toBe(true);
    });
});
