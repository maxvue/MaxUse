import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { lowerFirst } from './lowerFirst';

describe('lowerFirst', () => {
    it('converte o primeiro caractere para minúsculas', () => {
        expect(lowerFirst('Fred')).toBe('fred');
    });

    it('mantém o restante da string intacto', () => {
        expect(lowerFirst('FRED')).toBe('fRED');
    });

    it('lida com emoji (par substituto Unicode) como um único caractere (peculiaridade)', () => {
        expect(lowerFirst('😀BC')).toBe('😀BC');
    });

    it('retorna string vazia para null e undefined', () => {
        expect(lowerFirst(null)).toBe('');
        expect(lowerFirst(undefined)).toBe('');
    });

    it('funciona com Ref', () => {
        expect(lowerFirst(ref('Fred'))).toBe('fred');
    });
});
