import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { sum } from './sum';

describe('sum', () => {
    it('soma array de números', () => {
        expect(sum([1, 2, 3])).toBe(6);
    });

    it('retorna 0 para null', () => {
        expect(sum(null)).toBe(0);
    });

    it('soma Record (objeto com valores numéricos)', () => {
        expect(sum({ a: 10, b: 20 })).toBe(30);
    });

    it('ignora valores não numéricos (NaN → 0)', () => {
        expect(sum([1, 'abc', 3])).toBe(4);
    });

    it('funciona com Ref', () => {
        expect(sum(ref([10, 20]))).toBe(30);
    });

    // Testes de caracterização: a divergência em relação ao _.sum do Lodash é
    // DELIBERADA e faz parte do contrato público. Se algum destes falhar por uma
    // tentativa de "alinhar ao Lodash", a mudança é breaking change e precisa de
    // decisão consciente (ver README, "Divergências conhecidas em relação ao Lodash").
    describe('divergências deliberadas em relação ao Lodash', () => {
        it('NaN conta como 0 em vez de contaminar a soma', () => {
            expect(sum([6, 4, NaN])).toBe(10); // Lodash: NaN
        });

        it('strings numéricas são convertidas, não concatenadas', () => {
            expect(sum(['1', '2'])).toBe(3); // Lodash: '12'
        });

        it('strings não numéricas contam como 0', () => {
            expect(sum([1, 'abc', 2])).toBe(3); // Lodash: '1abc2' (concatena strings)
        });

        it('null e undefined na coleção contam como 0', () => {
            expect(sum([1, null, undefined, 2])).toBe(3); // Lodash também retorna 3
        });

        it('nunca retorna NaN', () => {
            expect(sum([NaN, 'abc', {}, undefined])).toBe(0);
        });
    });
});
