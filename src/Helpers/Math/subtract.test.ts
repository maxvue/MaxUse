import { describe, it, expect } from 'vitest';
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
});
