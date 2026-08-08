import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { has } from './has';

describe('has', () => {
    it('verifica caminho aninhado via string', () => {
        expect(has({ a: { b: 2 } }, 'a.b')).toBe(true);
        expect(has({ a: { b: 2 } }, 'a.c')).toBe(false);
    });

    it('suporta path como array', () => {
        expect(has({ a: { b: 2 } }, ['a', 'b'])).toBe(true);
    });

    it('suporta índice de array no caminho', () => {
        expect(has({ a: { b: [1, 2, 3] } }, 'a.b[1]')).toBe(true);
    });

    it('só próprias: não segue o protótipo', () => {
        function Foo() {}
        (Foo.prototype as any).a = 1;
        expect(has(new (Foo as any)(), 'a')).toBe(false);
    });

    it('considera presente mesmo quando o valor é undefined', () => {
        expect(has({ a: undefined }, 'a')).toBe(true);
    });

    it('trata string vazia como chave literal, não como caminho vazio', () => {
        expect(has({ '': 1 }, '')).toBe(true);
        expect(has({ '': 1 }, [])).toBe(false);
    });

    it('retorna false para null/undefined', () => {
        expect(has(null, 'a')).toBe(false);
        expect(has(undefined, 'a')).toBe(false);
    });

    it('funciona com Ref', () => {
        expect(has(ref({ a: 1 }), 'a')).toBe(true);
    });
});
