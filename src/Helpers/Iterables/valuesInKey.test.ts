import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { valuesInKey } from './valuesInKey';

describe('valuesInKey', () => {
    it('extrai valores de uma chave', () => {
        const items = [{ tags: ['a', 'b'] }, { tags: ['c'] }];
        const result = valuesInKey(items, 'tags');
        expect(result).toEqual(['a', 'b', 'c']);
    });

    it('extrai valores primitivos', () => {
        const items = [{ name: 'Ana' }, { name: 'Bruno' }];
        const result = valuesInKey(items, 'name');
        expect(result).toEqual(['Ana', 'Bruno']);
    });

    it('usa default_value quando chave não existe', () => {
        const items = [{ a: 1 }, { b: 2 }];
        const result = valuesInKey(items, 'c', 'N/A');
        expect(result).toEqual(['N/A', 'N/A']);
    });

    it('extrai valores de objetos aninhados', () => {
        const items = [{ meta: { x: 1, y: 2 } }];
        const result = valuesInKey(items, 'meta');
        expect(result).toEqual([1, 2]);
    });

    it('retorna array vazio para null', () => {
        expect(valuesInKey(null, 'key')).toEqual([]);
    });

    it('funciona com Record principal (object iterável)', () => {
        const obj = { item1: { tags: ['a'] }, item2: { tags: ['b'] } };
        expect(valuesInKey(obj, 'tags')).toEqual(['a', 'b']);
    });

    it('funciona com Ref', () => {
        const result = valuesInKey(ref([{ v: 10 }, { v: 20 }]), 'v');
        expect(result).toEqual([10, 20]);
    });
});
