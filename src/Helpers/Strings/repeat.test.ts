import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { repeat } from './repeat';

describe('repeat', () => {
    it('repete a string n vezes', () => {
        expect(repeat('abc', 2)).toBe('abcabc');
    });

    it('sem n, repete uma vez (peculiaridade)', () => {
        expect(repeat('abc')).toBe('abc');
    });

    it('retorna string vazia para n igual a 0 ou negativo', () => {
        expect(repeat('abc', 0)).toBe('');
        expect(repeat('abc', -1)).toBe('');
    });

    it('trunca n fracionário', () => {
        expect(repeat('abc', 2.5)).toBe('abcabc');
    });

    it('retorna string vazia para null e undefined', () => {
        expect(repeat(null, 2)).toBe('');
    });

    it('funciona com Ref', () => {
        expect(repeat(ref('ab'), ref(3))).toBe('ababab');
    });
});
