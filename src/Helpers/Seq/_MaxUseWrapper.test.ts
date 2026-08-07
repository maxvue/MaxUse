import { describe, it, expect } from 'vitest';
import { chain } from './chain';
import './thru';

describe('_MaxUseWrapper (design interno compartilhado)', () => {
    it('resolve múltiplas ações empilhadas na ordem em que foram encadeadas (não invertida)', () => {
        // Ordem importa: dividir por 2 depois somar 1 é diferente de somar 1
        // depois dividir por 2. Este teste falharia se _MaxUseWrapper.value()
        // aplicasse __actions__ em ordem invertida.
        const w = chain(10)
            .thru((n) => (n as number) / 2)
            .thru((n) => (n as number) + 1);
        expect(w.value()).toBe(6); // (10/2)+1 = 6, não (10+1)/2 = 5.5
    });

    it('três ações em sequência resolvem passando o resultado anterior adiante, na ordem certa', () => {
        const order: string[] = [];
        const w = chain([1])
            .thru((arr) => {
                order.push('a');
                return [...(arr as number[]), 2];
            })
            .thru((arr) => {
                order.push('b');
                return [...(arr as number[]), 3];
            })
            .thru((arr) => {
                order.push('c');
                return [...(arr as number[]), 4];
            });
        expect(w.value()).toEqual([1, 2, 3, 4]);
        expect(order).toEqual(['a', 'b', 'c']);
    });

    it('_pushAction nunca muta a instância original — cada chamada gera um wrapper novo e independente', () => {
        const base = chain([1, 2]);
        const w1 = base.thru((arr) => [...(arr as number[]), 'x']);
        const w2 = base.thru((arr) => [...(arr as number[]), 'y']);
        expect(base.__actions__).toEqual([]);
        expect(w1.value()).toEqual([1, 2, 'x']);
        expect(w2.value()).toEqual([1, 2, 'y']);
    });
});
