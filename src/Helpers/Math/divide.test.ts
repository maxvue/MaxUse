import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { divide } from './divide';

describe('divide', () => {
    it('divide dois números', () => {
        expect(divide(6, 4)).toBe(1.5);
    });

    it('retorna 1 quando chamado sem argumentos (peculiaridade)', () => {
        expect(divide()).toBe(1);
    });

    it('retorna o único valor fornecido quando o outro é undefined', () => {
        expect(divide(6)).toBe(6);
        expect(divide(undefined, 4)).toBe(4);
    });

    it('divisão por zero retorna Infinity', () => {
        expect(divide(6, 0)).toBe(Infinity);
    });

    it('quando algum operando é string, aplica o operador direto sem baseToNumber (peculiaridade)', () => {
        expect(divide('3', true)).toBeNaN();
        expect(divide(3, true)).toBe(3);
    });

    it('funciona com Ref', () => {
        expect(divide(ref(6), ref(4))).toBe(1.5);
    });
});
