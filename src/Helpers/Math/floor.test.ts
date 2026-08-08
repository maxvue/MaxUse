import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { floor } from './floor';

describe('floor', () => {
    it('arredonda para baixo sem precisão', () => {
        expect(floor(4.006)).toBe(4);
    });

    it('arredonda para baixo com precisão positiva (peculiaridade)', () => {
        expect(floor(0.046, 2)).toBe(0.04);
    });

    it('funciona com Ref', () => {
        expect(floor(ref(4.9))).toBe(4);
    });

    it('limita precisão a 292 casas decimais sem lançar erro (guarda de cap)', () => {
        expect(floor(4.006, 500)).toBe(4.006);
    });

    it('trunca precisão fracionária para inteiro antes de usar (peculiaridade)', () => {
        expect(floor(0.046, 2.9)).toBe(0.04);
    });
});
