import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { result } from './result';

describe('result', () => {
    it('retorna o valor no caminho', () => {
        expect(result({ a: { b: 1 } }, 'a.b', 'default')).toBe(1);
    });

    it('invoca funções encontradas no caminho, com this ligado ao pai', () => {
        expect(result({ a: { b: () => 5 } }, 'a.b', 'default')).toBe(5);
    });

    it('usa defaultValue quando o caminho não resolve', () => {
        expect(result({}, 'a.b', 'default')).toBe('default');
    });

    it('invoca defaultValue quando ele é uma função', () => {
        expect(result({}, 'a.b', () => 'lazy')).toBe('lazy');
    });

    it('retorna defaultValue para objeto null', () => {
        expect(result(null, 'a.b', 'def')).toBe('def');
    });

    it('caminho vazio usa defaultValue', () => {
        expect(result({ a: 1 }, [], 'def')).toBe('def');
    });

    it('resolve caminho profundo com múltiplos segmentos', () => {
        expect(result({ a: { b: { c: 1 } } }, 'a.b.c')).toBe(1);
    });

    it('invoca funções intermediárias no caminho', () => {
        expect(result({ a: () => ({ b: 2 }) }, 'a.b')).toBe(2);
    });

    it('retorna undefined quando não há defaultValue e o caminho não resolve', () => {
        expect(result({}, 'a.b')).toBeUndefined();
    });

    it('funciona com Ref', () => {
        expect(result(ref({ a: 1 }), ref('a'), 'def')).toBe(1);
    });
});
