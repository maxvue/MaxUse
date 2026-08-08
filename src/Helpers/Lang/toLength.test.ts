import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { toLength } from './toLength';

describe('toLength', () => {
    it('trunca a parte fracionária', () => {
        expect(toLength(1.5)).toBe(1);
    });

    it('grampeia negativos em 0', () => {
        expect(toLength(-1)).toBe(0);
    });

    it('grampeia acima de 4294967295 (peculiaridade: limite de comprimento de array)', () => {
        expect(toLength(4294967296)).toBe(4294967295);
    });

    it('retorna 0 para null e undefined', () => {
        expect(toLength(null)).toBe(0);
        expect(toLength(undefined)).toBe(0);
    });

    it('funciona com Ref', () => {
        expect(toLength(ref(3))).toBe(3);
        expect(toLength(ref(-1))).toBe(0);
    });
});
