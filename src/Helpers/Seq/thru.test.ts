import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { thru } from './thru';
import { chain } from './chain';
import './thru';

describe('thru', () => {
    it('retorna o resultado do interceptor (não o próprio valor)', () => {
        const result = thru('  abc  ', (v) => [v.trim()]);
        expect(result).toEqual(['abc']);
    });

    it('retorna o resultado do interceptor, mesmo que difira do tipo de entrada', () => {
        const result = thru([1, 2, 3], (arr) => arr.length);
        expect(result).toBe(3);
    });

    it('funciona com null/undefined como valor', () => {
        expect(thru(null, (v) => v)).toBeNull();
        expect(thru(undefined, (v) => v)).toBeUndefined();
    });

    it('funciona com Ref', () => {
        const result = thru(ref([1, 2, 3]), (arr) => arr.length);
        expect(result).toBe(3);
    });

    it('como método de instância do wrapper, retorna um novo wrapper encadeável', () => {
        const w = chain('  abc  ').thru((v) => [v.trim()]);
        expect(w.value()).toEqual(['abc']);
    });
});
