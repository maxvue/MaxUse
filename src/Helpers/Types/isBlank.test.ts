import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { isBlank, blank } from './isBlank';

describe('isBlank', () => {
    it('retorna true para null', () => {
        expect(isBlank(null)).toBe(true);
    });

    it('retorna true para undefined', () => {
        expect(isBlank(undefined)).toBe(true);
    });

    it('retorna true para string vazia', () => {
        expect(isBlank('')).toBe(true);
    });

    it('retorna true para string com espaços', () => {
        expect(isBlank('   ')).toBe(true);
    });

    it('retorna true para 0 quando if_zero é false (padrão)', () => {
        expect(isBlank(0)).toBe(true);
    });

    it('retorna false para 0 quando if_zero é true', () => {
        expect(isBlank(0, true)).toBe(false);
    });

    it('retorna false para string com texto', () => {
        expect(isBlank('hello')).toBe(false);
    });

    it('retorna false para número diferente de 0', () => {
        expect(isBlank(42)).toBe(false);
    });

    // Reatividade
    it('funciona com Ref', () => {
        expect(isBlank(ref(''))).toBe(true);
        expect(isBlank(ref('texto'))).toBe(false);
    });

    it('funciona com Getter', () => {
        expect(isBlank(() => null)).toBe(true);
        expect(isBlank(() => 'valor')).toBe(false);
    });
});

describe('blank (alias)', () => {
    it('é funcional como alias de isBlank', () => {
        expect(blank(null)).toBe(true);
        expect(blank('hello')).toBe(false);
        expect(blank(0, true)).toBe(false);
    });
});
