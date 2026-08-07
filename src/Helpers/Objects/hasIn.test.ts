import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { hasIn } from './hasIn';

describe('hasIn', () => {
    it('verifica caminho aninhado via string', () => {
        expect(hasIn({ a: { b: 2 } }, 'a.b')).toBe(true);
        expect(hasIn({ a: { b: 2 } }, 'a.c')).toBe(false);
    });

    it('inclui herdadas: encontra propriedade no protótipo', () => {
        function Foo() {}
        (Foo.prototype as any).a = 1;
        expect(hasIn(new (Foo as any)(), 'a')).toBe(true);
    });

    it('suporta path como array', () => {
        expect(hasIn({ a: { b: 2 } }, ['a', 'b'])).toBe(true);
    });

    it('trata string vazia como chave literal, não como caminho vazio', () => {
        expect(hasIn({ '': 1 }, '')).toBe(true);
        expect(hasIn({ '': 1 }, [])).toBe(false);
    });

    it('não lança quando um segmento intermediário resolve para um primitivo', () => {
        expect(hasIn({ a: 1 }, 'a.b')).toBe(false);
        expect(hasIn({ a: 1 }, ['a', 'b'])).toBe(false);
        expect(hasIn({ a: { b: { c: 1 } } }, 'a.b.c.d')).toBe(false);
    });

    it('encontra propriedades de string via boxing (String.prototype)', () => {
        expect(hasIn('abc', 'length')).toBe(true);
        expect(hasIn({ a: 'str' }, 'a.length')).toBe(true);
    });

    it('retorna false para null/undefined', () => {
        expect(hasIn(null, 'a')).toBe(false);
        expect(hasIn(undefined, 'a')).toBe(false);
    });

    it('funciona com Ref', () => {
        expect(hasIn(ref({ a: 1 }), 'a')).toBe(true);
    });
});
