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

    // Referências circulares
    it('não estoura a pilha com referência circular direta', () => {
        const source: any = { name: 'a' };
        source.self = source;

        expect(() => deepMerge({} as any, source)).not.toThrow();
    });

    it('não estoura a pilha com ciclo aninhado', () => {
        const source: any = { name: 'a', b: { name: 'b' } };
        source.b.parent = source;

        expect(() => deepMerge({} as any, source)).not.toThrow();
    });

    it('reconstrói o ciclo no alvo em vez de duplicar infinitamente', () => {
        const source: any = { name: 'a' };
        source.b = { name: 'b', a: source };

        const result = deepMerge({} as any, source);
        expect(result.b.a).toBe(result);
        expect(result.name).toBe('a');
        expect(result.b.name).toBe('b');
    });

    // Isolamento de referências
    it('não compartilha referência de array com a fonte', () => {
        const source = { items: [1, 2, 3] };
        const result = deepMerge({} as any, source);

        result.items.push(4);
        expect(source.items).toEqual([1, 2, 3]);
    });

    it('não compartilha referência de objeto aninhado com a fonte', () => {
        const source = { config: { theme: 'dark' } };
        const result = deepMerge({} as any, source);

        result.config.theme = 'light';
        expect(source.config.theme).toBe('dark');
    });

    it('preserva Date, Map, Set e instâncias de classe', () => {
        class Custom {
            constructor(public value = 1) {}
        }

        const source = {
            d: new Date(2020, 0, 1),
            s: new Set([1]),
            m: new Map([['a', 1]]),
            c: new Custom()
        };
        const result = deepMerge({} as any, source);

        expect(result.d).toBeInstanceOf(Date);
        expect(result.d.getTime()).toBe(source.d.getTime());
        expect(result.s).toBeInstanceOf(Set);
        expect(result.m).toBeInstanceOf(Map);
        expect(result.c).toBeInstanceOf(Custom);
    });

    it('preserva instâncias de classe no alvo raiz e aninhado', () => {
        class Cfg {
            constructor(
                public a = 1,
                public keep = 'preservar'
            ) {}
        }

        const rootTarget = new Cfg() as any;
        const rootResult = deepMerge(rootTarget, { b: 2 }) as any;
        expect(rootResult.b).toBe(2);
        expect(rootResult.a).toBe(1);
        expect(rootResult.keep).toBe('preservar');
        expect(rootResult instanceof Cfg).toBe(true);

        const nestedTarget: any = { cfg: new Cfg() };
        const nestedResult: any = deepMerge(nestedTarget, { cfg: { b: 2 } });
        expect(nestedResult.cfg.a).toBe(1);
        expect(nestedResult.cfg.keep).toBe('preservar');
        expect(nestedResult.cfg.b).toBe(2);
        expect(nestedResult.cfg instanceof Cfg).toBe(true);
    });

    it('não muta o array de sources recebido', () => {
        const sources = [{ b: 2 }, { c: 3 }];
        deepMerge({ a: 1 } as any, ...sources);

        expect(sources).toHaveLength(2);
    });
});

