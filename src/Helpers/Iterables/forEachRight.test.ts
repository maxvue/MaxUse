import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { forEachRight } from './forEachRight';

describe('forEachRight', () => {
    it('itera sobre um array na ordem inversa', () => {
        const out: unknown[] = [];
        forEachRight([10, 20, 30], (v, i) => out.push([v, i]));
        expect(out).toEqual([[30, 2], [20, 1], [10, 0]]);
    });

    it('itera sobre um objeto na ordem inversa das chaves', () => {
        const out: unknown[] = [];
        forEachRight({ a: 1, b: 2 }, (v, k) => out.push([v, k]));
        expect(out).toEqual([[2, 'b'], [1, 'a']]);
    });

    it('para a iteração antecipadamente quando o callback retorna false', () => {
        const out: unknown[] = [];
        forEachRight([1, 2, 3], (v) => {
            out.push(v);
            if (v === 2) return false;
        });
        expect(out).toEqual([3, 2]);
    });

    it('retorna a própria coleção', () => {
        const arr = [1, 2, 3];
        expect(forEachRight(arr, () => {})).toBe(arr);
    });

    it('retorna null/undefined intocado', () => {
        expect(forEachRight(null, () => {})).toBeNull();
    });

    it('funciona com Ref', () => {
        const out: unknown[] = [];
        forEachRight(ref([1, 2]), (v) => out.push(v));
        expect(out).toEqual([2, 1]);
    });
});
