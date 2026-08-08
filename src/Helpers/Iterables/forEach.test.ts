import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { forEach } from './forEach';

describe('forEach', () => {
    it('itera sobre um array na ordem, repassando valor e índice', () => {
        const out: unknown[] = [];
        forEach([10, 20, 30], (v, i) => out.push([v, i]));
        expect(out).toEqual([[10, 0], [20, 1], [30, 2]]);
    });

    it('itera sobre um objeto, repassando valor e chave', () => {
        const out: unknown[] = [];
        forEach({ a: 1, b: 2 }, (v, k) => out.push([v, k]));
        expect(out).toEqual([[1, 'a'], [2, 'b']]);
    });

    it('peculiaridade: para a iteração antecipadamente quando o callback retorna false', () => {
        const out: unknown[] = [];
        forEach([1, 2, 3], (v) => {
            out.push(v);
            if (v === 2) return false;
        });
        expect(out).toEqual([1, 2]);
    });

    it('retorna a própria coleção', () => {
        const arr = [1, 2, 3];
        expect(forEach(arr, () => {})).toBe(arr);
    });

    it('retorna null/undefined intocado para coleção null/undefined', () => {
        expect(forEach(null, () => {})).toBeNull();
        expect(forEach(undefined, () => {})).toBeUndefined();
    });

    it('funciona com Ref', () => {
        const out: unknown[] = [];
        forEach(ref([1, 2]), (v) => out.push(v));
        expect(out).toEqual([1, 2]);
    });
});
