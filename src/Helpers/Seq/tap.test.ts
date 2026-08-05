import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { tap } from './tap';

describe('tap', () => {
    it('executa o interceptor e retorna o valor original', () => {
        const visto: number[] = [];
        const resultado = tap([1, 2, 3], (v) => { visto.push(...v); });
        expect(resultado).toEqual([1, 2, 3]);
        expect(visto).toEqual([1, 2, 3]);
    });

    it('funciona com Ref', () => {
        expect(tap(ref([1, 2]), () => {})).toEqual([1, 2]);
    });
});
