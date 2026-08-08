import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { unescape } from './unescape';

describe('unescape', () => {
    it('desescapa entidades HTML (peculiaridade)', () => {
        expect(unescape('&lt;a&gt;b&amp;c&quot;d&#39;e&lt;/a&gt;')).toBe('<a>b&c"d\'e</a>');
    });

    it('retorna a mesma string quando não há entidades', () => {
        expect(unescape('abc')).toBe('abc');
    });

    it('retorna string vazia para null e undefined', () => {
        expect(unescape(null)).toBe('');
        expect(unescape(undefined)).toBe('');
    });

    it('funciona com Ref', () => {
        expect(unescape(ref('&lt;b&gt;'))).toBe('<b>');
    });
});
