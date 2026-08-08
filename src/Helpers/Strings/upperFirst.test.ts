import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { upperFirst } from './upperFirst';

describe('upperFirst', () => {
    it('converte o primeiro caractere para maiúsculas', () => {
        expect(upperFirst('fred')).toBe('Fred');
    });

    it('mantém o restante da string intacto', () => {
        expect(upperFirst('FRED')).toBe('FRED');
    });

    it('lida com emoji (par substituto Unicode) como um único caractere (peculiaridade)', () => {
        expect(upperFirst('😀bc')).toBe('😀bc');
    });

    it('retorna string vazia para null e undefined', () => {
        expect(upperFirst(null)).toBe('');
        expect(upperFirst(undefined)).toBe('');
    });

    it('funciona com Ref', () => {
        expect(upperFirst(ref('fred'))).toBe('Fred');
    });
});
