import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { join } from './join';

describe('join', () => {
    it('junta com vírgula por padrão', () => {
        expect(join([1, 2, 3])).toBe('1,2,3');
    });

    it('junta com separador customizado', () => {
        expect(join([1, 2, 3], '-')).toBe('1-2-3');
    });

    it('retorna string vazia para null', () => {
        expect(join(null)).toBe('');
    });

    it('retorna string vazia para undefined', () => {
        expect(join(undefined)).toBe('');
    });

    it('retorna string vazia para array vazio', () => {
        expect(join([])).toBe('');
    });

    it('funciona com Ref', () => {
        expect(join(ref([1, 2, 3]), '-')).toBe('1-2-3');
    });
});
