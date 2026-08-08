import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { mapKeys } from './mapKeys';

describe('mapKeys', () => {
    it('remapeia as chaves derivando o novo nome da função', () => {
        expect(mapKeys({ a: 1, b: 2 }, (v: number, k: string) => k + v)).toEqual({ a1: 1, b2: 2 });
    });

    it('retorna objeto vazio para objeto null ou undefined', () => {
        expect(mapKeys(null, () => 1)).toEqual({});
    });

    it('funciona com Ref', () => {
        expect(mapKeys(ref({ a: 1 }), (v: number, k: string) => k.toUpperCase())).toEqual({ A: 1 });
    });
});
