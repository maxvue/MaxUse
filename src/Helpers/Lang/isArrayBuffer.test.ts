import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { isArrayBuffer } from './isArrayBuffer';

describe('isArrayBuffer', () => {
    it('retorna true para ArrayBuffer', () => {
        expect(isArrayBuffer(new ArrayBuffer(2))).toBe(true);
    });

    it('retorna false para TypedArray (não é o ArrayBuffer em si)', () => {
        expect(isArrayBuffer(new Int8Array(2))).toBe(false);
    });

    it('retorna false para outros tipos', () => {
        expect(isArrayBuffer(null)).toBe(false);
        expect(isArrayBuffer(undefined)).toBe(false);
        expect(isArrayBuffer([])).toBe(false);
        expect(isArrayBuffer({})).toBe(false);
    });

    it('funciona com Ref', () => {
        expect(isArrayBuffer(ref(new ArrayBuffer(2)))).toBe(true);
        expect(isArrayBuffer(ref(1))).toBe(false);
    });
});
