import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { inRange } from './inRange';

describe('inRange', () => {
    it('retorna true quando o número está no intervalo [start, end)', () => {
        expect(inRange(3, 2, 4)).toBe(true);
        expect(inRange(4, 2, 4)).toBe(false);
    });

    it('quando end é omitido, start vira 0 e o valor original vira end (peculiaridade)', () => {
        expect(inRange(4, 8)).toBe(true);
        expect(inRange(4, 2)).toBe(false);
    });

    it('troca start/end automaticamente quando start > end', () => {
        expect(inRange(-3, -2, -6)).toBe(true);
    });

    it('funciona com números decimais', () => {
        expect(inRange(1.2, 2)).toBe(true);
    });

    it('funciona com Ref', () => {
        expect(inRange(ref(3), ref(2), ref(4))).toBe(true);
    });
});
