import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { add } from './add';

describe('add', () => {
    it('soma dois números', () => {
        expect(add(6, 4)).toBe(10);
    });

    it('retorna 0 quando chamado sem argumentos (peculiaridade)', () => {
        expect(add()).toBe(0);
    });

    it('retorna o único valor fornecido quando o outro é undefined', () => {
        expect(add(6)).toBe(6);
        expect(add(undefined, 4)).toBe(4);
    });

    it('concatena quando algum operando é string (peculiaridade)', () => {
        expect(add('3', '4')).toBe('34');
        expect(add(3, '4')).toBe('34');
    });

    it('preserva -0 ao concatenar com string (peculiaridade)', () => {
        expect(add(-0, '3')).toBe('-03');
    });

    it('converte null em texto literal "null" ao concatenar (peculiaridade)', () => {
        expect(add(null, '3')).toBe('null3');
        expect(add('3', null)).toBe('3null');
    });

    it('funciona com Ref', () => {
        expect(add(ref(6), ref(4))).toBe(10);
    });
});
