import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { isEqualWith } from './isEqualWith';

describe('isEqualWith', () => {
    it('cai de volta na comparação profunda padrão quando customizer retorna undefined (peculiaridade)', () => {
        expect(isEqualWith({ a: 1 }, { a: 1 })).toBe(true);
        expect(isEqualWith({ a: 1 }, { a: 1 }, () => undefined)).toBe(true);
    });

    it('usa o resultado do customizer quando ele não retorna undefined', () => {
        const customizer = (value: unknown, other: unknown) =>
            typeof value === 'string' && typeof other === 'string'
                ? value.toLowerCase() === other.toLowerCase()
                : undefined;
        expect(isEqualWith('abc', 'ABC', customizer)).toBe(true);
        expect(isEqualWith('abc', 'xyz', customizer)).toBe(false);
    });

    it('permite customizer forçar resultado', () => {
        expect(isEqualWith({ a: 1 }, { a: 1 }, () => false)).toBe(false);
        expect(isEqualWith({ a: 1 }, { a: 99 }, () => true)).toBe(true);
    });

    it('exige igualdade total, diferente do isMatch (chaves extras quebram a igualdade)', () => {
        expect(isEqualWith({ a: 1 }, { a: 1, b: 2 })).toBe(false);
    });

    it('compara arrays por comprimento e posição', () => {
        expect(isEqualWith([1, 2, 3], [1, 2, 3])).toBe(true);
        expect(isEqualWith([1, 2], [1, 2, 3])).toBe(false);
    });

    it('trata referências circulares sem estourar a pilha', () => {
        const a: Record<string, unknown> = { x: 1 };
        a.self = a;
        const b: Record<string, unknown> = { x: 1 };
        b.self = b;
        expect(isEqualWith(a, b)).toBe(true);
    });

    it('funciona com Ref', () => {
        expect(isEqualWith(ref({ a: 1 }), ref({ a: 1 }))).toBe(true);
        expect(isEqualWith(ref(NaN), NaN)).toBe(true);
    });

    it('desembrulha wrappers de primitivo (peculiaridade)', () => {

        expect(isEqualWith(new Number(1), 1)).toBe(true);

        expect(isEqualWith(new String('a'), 'a')).toBe(true);

        expect(isEqualWith(new Boolean(true), true)).toBe(true);
    });

    it('instâncias de classes diferentes com os mesmos campos não são iguais (peculiaridade)', () => {
        class Foo { x = 1; }
        class Bar { x = 1; }
        expect(isEqualWith(new Foo(), new Bar())).toBe(false);
        expect(isEqualWith(new Foo(), new Foo())).toBe(true);
        expect(isEqualWith(new Foo(), { x: 1 })).toBe(false);
    });
});
