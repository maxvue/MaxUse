import { describe, it, expect, afterEach } from 'vitest';
import { ref } from 'vue';
import { deepMerge } from './deepMerge';

describe('deepMerge', () => {
    afterEach(() => {
        delete (Object.prototype as any).polluted;
        delete (Object.prototype as any).x;
    });

    it('faz merge raso de propriedades simples', () => {
        const target = { a: 1 };
        const source = { b: 2 };
        const result = deepMerge(target, source);
        expect(result).toEqual({ a: 1, b: 2 });
    });

    it('sobrescreve propriedades existentes', () => {
        const target = { a: 1 };
        const source = { a: 99 };
        expect(deepMerge(target, source)).toEqual({ a: 99 });
    });

    it('faz merge profundo de objetos aninhados', () => {
        const target = { config: { theme: 'dark', lang: 'pt' } };
        const source = { config: { theme: 'light' } };
        const result = deepMerge(target, source);
        expect(result).toEqual({ config: { theme: 'light', lang: 'pt' } });
    });

    it('substitui arrays (não faz merge de arrays)', () => {
        const target = { items: [1, 2, 3] };
        const source = { items: [4, 5] };
        expect(deepMerge(target, source)).toEqual({ items: [4, 5] });
    });

    it('retorna target se ambos os inputs principais forem arrays', () => {
        const target = [1, 2];
        const source = [3, 4];
        expect(deepMerge(target, source)).toEqual([1, 2]); // Como não faz merge de arrays no nível raiz, ele pula a lógica de object merge
    });

    it('suporta múltiplos sources', () => {
        const target = { a: 1 };
        const s1 = { b: 2 };
        const s2 = { c: 3 };
        expect(deepMerge(target, s1, s2)).toEqual({ a: 1, b: 2, c: 3 });
    });

    it('retorna target quando não há sources', () => {
        const target = { a: 1 };
        expect(deepMerge(target)).toEqual({ a: 1 });
    });

    it('cria caminhos intermediários quando target não tem a chave', () => {
        const target = {} as any;
        const source = { nested: { deep: true } };
        expect(deepMerge(target, source)).toEqual({ nested: { deep: true } });
    });

    // Reatividade
    it('funciona com Ref como target', () => {
        const target = ref({ a: 1 });
        const source = { b: 2 };
        const result = deepMerge(target, source);
        expect(result).toEqual({ a: 1, b: 2 });
    });

    // Segurança
    it('não polui Object.prototype via __proto__', () => {
        deepMerge({} as any, JSON.parse('{"__proto__":{"polluted":"YES"}}'));
        expect(({} as any).polluted).toBeUndefined();
    });

    it('ignora chaves constructor/prototype', () => {
        deepMerge({} as any, JSON.parse('{"constructor":{"prototype":{"x":1}}}'));
        expect(({} as any).x).toBeUndefined();
    });
});

