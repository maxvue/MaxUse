import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { sumBy } from './sumBy';

describe('sumBy', () => {
    it('soma por string key', () => {
        const items = [{ v: 10 }, { v: 20 }, { v: 30 }];
        expect(sumBy(items, 'v')).toBe(60);
    });

    it('retorna 0 para null', () => {
        expect(sumBy(null, 'v')).toBe(0);
    });

    it('soma Record (objeto de objetos)', () => {
        const obj = { a: { v: 5 }, b: { v: 15 } };
        expect(sumBy(obj, 'v')).toBe(20);
    });

    it('ignora valores não numéricos', () => {
        const items = [{ v: 10 }, { v: 'abc' }, { v: 5 }];
        expect(sumBy(items, 'v')).toBe(15);
    });

    it('funciona com Ref', () => {
        expect(sumBy(ref([{ v: 3 }, { v: 7 }]), 'v')).toBe(10);
    });

    it('soma por caminho profundo pontuado (dot notation)', () => {
        const modules = [
            { id: 1, data_specs: { voc: 45.2 } },
            { id: 2, data_specs: { voc: 45.2 } },
            { id: 3, data_specs: { voc: 10 } }
        ];
        expect(sumBy(modules, 'data_specs.voc')).toBe(100.4);
    });

    it('soma por função iteratee', () => {
        const modules = [
            { id: 1, data_specs: { voc: 45.2 } },
            { id: 2, data_specs: { voc: 45.2 } }
        ];
        expect(sumBy(modules, (m: any) => m.data_specs.voc)).toBe(90.4);
    });

    it('coerção graciosa para 0 em caminhos aninhados incompletos ou nulos', () => {
        const items = [
            { data_specs: { voc: 45.2 } },
            { data_specs: null },
            { data_specs: {} },
            {}
        ];
        expect(sumBy(items, 'data_specs.voc')).toBe(45.2);
    });

    it('soma elementos diretamente quando iteratee é omitido ou nulo', () => {
        expect(sumBy([10, 20, 30])).toBe(60);
    });

    // Testes de caracterização: a divergência em relação ao _.sumBy do Lodash é
    // DELIBERADA e faz parte do contrato público. Se algum destes falhar por uma
    // tentativa de "alinhar ao Lodash", a mudança é breaking change e precisa de
    // decisão consciente (ver README, "Divergências conhecidas em relação ao Lodash").
    describe('divergências deliberadas em relação ao Lodash', () => {
        it('strings não numéricas contam como 0, sem concatenar', () => {
            expect(sumBy([{ a: 'x' }, { a: 2 }], 'a')).toBe(2); // Lodash: 'x2'
        });

        it('NaN conta como 0 em vez de contaminar a soma', () => {
            expect(sumBy([{ a: NaN }, { a: 5 }], 'a')).toBe(5); // Lodash: NaN
        });

        it('null e chave ausente contam como 0', () => {
            expect(sumBy([{ a: null }, { a: 2 }, {}], 'a')).toBe(2);
        });

        it('strings numéricas são convertidas', () => {
            expect(sumBy([{ a: '10' }, { a: '5' }], 'a')).toBe(15); // Lodash: '105'
        });

        it('nunca retorna NaN', () => {
            expect(sumBy([{ a: 'abc' }, { a: undefined }], 'a')).toBe(0);
        });
    });
});
