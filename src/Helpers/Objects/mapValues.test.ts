import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { mapValues } from './mapValues';

describe('mapValues', () => {
    it('transforma todos os valores do objeto', () => {
        const obj = { a: 1, b: 2, c: 3 };
        const result = mapValues(obj, (v) => v * 2);
        expect(result).toEqual({ a: 2, b: 4, c: 6 });
    });

    it('fornece chave e objeto na callback', () => {
        const obj = { x: 'hello' };
        mapValues(obj, (val, key, o) => {
            expect(key).toBe('x');
            expect(o).toBe(obj);
            return val;
        });
    });

    it('retorna objeto vazio para input vazio', () => {
        expect(mapValues({}, (v) => v)).toEqual({});
    });

    it('retorna objeto vazio para null', () => {
        expect(mapValues(null, (v) => v)).toEqual({});
    });

    it('retorna objeto vazio para undefined', () => {
        expect(mapValues(undefined, (v) => v)).toEqual({});
    });

    it('retorna objeto vazio para Ref nula', () => {
        expect(mapValues(ref(null), (v) => v)).toEqual({});
    });

    // Reatividade
    it('funciona com Ref', () => {
        const obj = ref({ a: 10, b: 20 });
        const result = mapValues(obj, (v) => (v as number) + 1);
        expect(result).toEqual({ a: 11, b: 21 });
    });
});
