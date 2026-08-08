import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { random } from './random';

describe('random', () => {
    it('sem argumentos, retorna número entre 0 e 1 (inclusivo)', () => {
        for (let i = 0; i < 50; i++) {
            const r = random();
            expect(r).toBeGreaterThanOrEqual(0);
            expect(r).toBeLessThanOrEqual(1);
        }
    });

    it('com um argumento, gera inteiro entre 0 e o limite (peculiaridade: upper vira o único argumento)', () => {
        for (let i = 0; i < 50; i++) {
            const r = random(5);
            expect(Number.isInteger(r)).toBe(true);
            expect(r).toBeGreaterThanOrEqual(0);
            expect(r).toBeLessThanOrEqual(5);
        }
    });

    it('com dois argumentos, gera inteiro no intervalo', () => {
        for (let i = 0; i < 50; i++) {
            const r = random(5, 10);
            expect(Number.isInteger(r)).toBe(true);
            expect(r).toBeGreaterThanOrEqual(5);
            expect(r).toBeLessThanOrEqual(10);
        }
    });

    it('gera float quando algum limite tem casas decimais', () => {
        for (let i = 0; i < 50; i++) {
            const r = random(1.2, 5.2);
            expect(r).toBeGreaterThanOrEqual(1.2);
            expect(r).toBeLessThanOrEqual(5.2);
        }
    });

    it('força float com a flag floating=true', () => {
        for (let i = 0; i < 50; i++) {
            const r = random(0, 5, true);
            expect(r).toBeGreaterThanOrEqual(0);
            expect(r).toBeLessThanOrEqual(5);
        }
    });

    it('troca lower/upper automaticamente quando lower > upper', () => {
        for (let i = 0; i < 50; i++) {
            const r = random(10, 2);
            expect(r).toBeGreaterThanOrEqual(2);
            expect(r).toBeLessThanOrEqual(10);
        }
    });

    it('funciona com Ref', () => {
        for (let i = 0; i < 20; i++) {
            const r = random(ref(5), ref(10));
            expect(r).toBeGreaterThanOrEqual(5);
            expect(r).toBeLessThanOrEqual(10);
        }
    });
});
