import { describe, it, expect, expectTypeOf } from 'vitest';
import { ref } from 'vue';
import { subtract } from './subtract';

describe('subtract', () => {
    it('subtrai dois números', () => {
        expect(subtract(6, 4)).toBe(2);
    });

    it('retorna 0 quando chamado sem argumentos (peculiaridade)', () => {
        expect(subtract()).toBe(0);
    });

    it('retorna o único valor fornecido quando o outro é undefined', () => {
        expect(subtract(6)).toBe(6);
        expect(subtract(undefined, 4)).toBe(4);
    });

    it('converte strings numéricas para número (diferente do add, não concatena)', () => {
        expect(subtract('3', '4')).toBe(-1);
        expect(subtract(3, '4')).toBe(-1);
    });

    it('funciona com Ref', () => {
        expect(subtract(ref(6), ref(4))).toBe(2);
    });

    it('possui assinatura de tipo com retorno estritamente number', () => {
        expectTypeOf(subtract).returns.toEqualTypeOf<number>();
        expectTypeOf(subtract('10', '4')).toEqualTypeOf<number>();
        expectTypeOf(subtract(10, 4)).toEqualTypeOf<number>();
    });

    it('nunca concatena strings, sempre retornando a diferenca numerica', () => {
        const res = subtract('10', '4');
        expect(res).toBe(6);
        expect(typeof res).toBe('number');
        expect(res).not.toBe('104');
    });

    it('quando algum operando é string, aplica o operador direto sem baseToNumber (peculiaridade)', () => {
        expect(subtract('3', true)).toBeNaN();
        expect(subtract(3, true)).toBe(2);
    });

    it('converte null/undefined em texto literal ao aplicar baseToString em ambos operandos (peculiaridade)', () => {
        expect(subtract('1', null)).toBeNaN();
        expect(subtract(null, '1')).toBeNaN();
    });
});

