import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { escape } from './escape';

describe('escape', () => {
    it('escapa &, <, >, " e \' (peculiaridade)', () => {
        expect(escape('<a>b&c"d\'e</a>')).toBe('&lt;a&gt;b&amp;c&quot;d&#39;e&lt;/a&gt;');
    });

    it('retorna a mesma string quando não há caracteres a escapar', () => {
        expect(escape('abc')).toBe('abc');
    });

    it('retorna string vazia para null e undefined', () => {
        expect(escape(null)).toBe('');
        expect(escape(undefined)).toBe('');
    });

    it('funciona com Ref', () => {
        expect(escape(ref('<b>'))).toBe('&lt;b&gt;');
    });
});
