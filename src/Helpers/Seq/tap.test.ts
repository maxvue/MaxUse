import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { tap } from './tap';

describe('tap', () => {
    it('invoca o interceptor com o valor (efeito colateral)', () => {
        const spy: number[] = [];
        tap(5, (v) => spy.push(v));
        expect(spy).toEqual([5]);
    });

    it('retorna o próprio valor, não o retorno do interceptor', () => {
        const result = tap([1, 2, 3], (arr) => {
            arr.push(4);
            return 'ignorado' as any;
        });
        expect(result).toEqual([1, 2, 3, 4]);
    });

    it('funciona com null/undefined como valor', () => {
        expect(tap(null, () => {})).toBeNull();
        expect(tap(undefined, () => {})).toBeUndefined();
    });

    it('funciona com Ref', () => {
        const spy: number[] = [];
        const result = tap(ref(10), (v) => spy.push(v));
        expect(result).toBe(10);
        expect(spy).toEqual([10]);
    });
});
