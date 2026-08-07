import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { startsWith } from './startsWith';

describe('startsWith', () => {
    it('verifica se a string começa com o alvo', () => {
        expect(startsWith('abc', 'a')).toBe(true);
        expect(startsWith('abc', 'b')).toBe(false);
    });

    it('aceita posição inicial customizada (peculiaridade)', () => {
        expect(startsWith('abc', 'b', 1)).toBe(true);
    });

    it('retorna false para null e undefined', () => {
        expect(startsWith(null, 'a')).toBe(false);
    });

    it('funciona com Ref', () => {
        expect(startsWith(ref('abc'), ref('a'))).toBe(true);
    });
});
