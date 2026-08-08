import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { isTypedArray } from './isTypedArray';

describe('isTypedArray', () => {
    it('retorna true para os TypedArrays comuns', () => {
        expect(isTypedArray(new Int8Array(2))).toBe(true);
        expect(isTypedArray(new Uint8Array(2))).toBe(true);
        expect(isTypedArray(new Float64Array(2))).toBe(true);
    });

    it('retorna true para BigInt64Array e BigUint64Array (paridade com lodash-es 4.18.1)', () => {
        expect(isTypedArray(new BigInt64Array(2))).toBe(true);
        expect(isTypedArray(new BigUint64Array(2))).toBe(true);
    });

    it('retorna false para Array comum', () => {
        expect(isTypedArray([1, 2, 3])).toBe(false);
    });

    it('retorna false para outros tipos', () => {
        expect(isTypedArray(null)).toBe(false);
        expect(isTypedArray(undefined)).toBe(false);
        expect(isTypedArray({})).toBe(false);
        expect(isTypedArray(new ArrayBuffer(2))).toBe(false);
    });

    it('funciona com Ref', () => {
        expect(isTypedArray(ref(new Int8Array(2)))).toBe(true);
        expect(isTypedArray(ref([1, 2]))).toBe(false);
    });
});
