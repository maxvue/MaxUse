import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { average } from './average';

describe('average', () => {
    it('calcula a média de números inteiros', () => {
        expect(average([2, 4, 6])).toBe(4);
    });

    it('calcula a média de floats', () => {
        expect(average([1.5, 2.5])).toBe(2);
    });

    it('retorna 0 para array vazio', () => {
        expect(average([])).toBe(0);
    });

    it('retorna o próprio número para array unitário', () => {
        expect(average([42])).toBe(42);
    });

    it('lida com valores negativos', () => {
        expect(average([-10, 10])).toBe(0);
    });

    // Reatividade
    it('funciona com Ref', () => {
        expect(average(ref([10, 20, 30]))).toBe(20);
    });

    it('funciona com Getter', () => {
        expect(average(() => [100, 200])).toBe(150);
    });
});

describe('average — regressão auditoria (achado 023)', () => {
    it.each([null, undefined])('retorna 0 sem lançar para %p', (input) => {
        expect(() => average(input as any)).not.toThrow();
        expect(average(input as any)).toBe(0);
    });

    it('ignora valores não numéricos em vez de retornar NaN', () => {
        expect(average([2, null as any, 4])).toBe(3);
        expect(average([1, 'a' as any, 3])).toBe(2);
    });

    it('retorna 0 quando nenhum valor é numérico', () => {
        expect(average([null as any, undefined as any])).toBe(0);
    });
});
