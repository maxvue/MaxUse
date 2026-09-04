import { describe, it, expect, vi, afterEach } from 'vitest';
import { ref } from 'vue';
import { random } from './random';

/** Valor de `Math.random()` imediatamente abaixo de 1, o máximo representável. */
const QUASE_UM = 0.9999999999999999;

/** Crava o retorno de `Math.random()` para tornar os limites determinísticos. */
function stubRandom(...valores: number[]): void {
    const spy = vi.spyOn(Math, 'random');
    for (const valor of valores) spy.mockReturnValueOnce(valor);
    spy.mockReturnValue(valores[valores.length - 1]);
}

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

    describe('limites determinísticos (Math.random cravado)', () => {
        afterEach(() => vi.restoreAllMocks());

        it('atinge exatamente o limite inferior e o superior com dois argumentos', () => {
            stubRandom(0);
            expect(random(5, 10)).toBe(5);

            vi.restoreAllMocks();
            stubRandom(QUASE_UM);
            expect(random(5, 10)).toBe(10);
        });

        it('atinge exatamente os limites com um único argumento', () => {
            stubRandom(0);
            expect(random(5)).toBe(0);

            vi.restoreAllMocks();
            stubRandom(QUASE_UM);
            expect(random(5)).toBe(5);
        });

        it('atinge os limites mesmo com os argumentos invertidos', () => {
            stubRandom(0);
            expect(random(10, 2)).toBe(2);

            vi.restoreAllMocks();
            stubRandom(QUASE_UM);
            expect(random(10, 2)).toBe(10);
        });

        it('respeita os limites no caminho de ponto flutuante', () => {
            stubRandom(0);
            expect(random(0, 5, true)).toBe(0);

            vi.restoreAllMocks();
            stubRandom(QUASE_UM);
            const alto = random(0, 5, true);
            expect(alto).toBeLessThanOrEqual(5);
            expect(alto).toBeGreaterThan(4.99);
            expect(Number.isInteger(alto)).toBe(false);
        });

        it('sem argumentos, cobre o intervalo fechado [0, 1]', () => {
            stubRandom(0);
            expect(random()).toBe(0);

            vi.restoreAllMocks();
            stubRandom(QUASE_UM);
            expect(random()).toBe(1);
        });
    });

    describe('uso como iteratee de .map()', () => {
        afterEach(() => vi.restoreAllMocks());

        it('ignora index/array e se comporta como random(valor) — limite inferior', () => {
            stubRandom(0);
            const saida = [4, 8].map(random as unknown as (n: number) => number);

            expect(saida).toEqual([0, 0]);
            expect(saida.every(Number.isInteger)).toBe(true);
        });

        it('ignora index/array e se comporta como random(valor) — limite superior', () => {
            stubRandom(QUASE_UM);
            const saida = [4, 8].map(random as unknown as (n: number) => number);

            expect(saida).toEqual([4, 8]);
            expect(saida.every(Number.isInteger)).toBe(true);
        });

        it('nunca produz float ao ser usado como iteratee', () => {
            const saida = [4, 8, 15, 16].map(random as unknown as (n: number) => number);

            expect(saida.every(Number.isInteger)).toBe(true);
            saida.forEach((valor, i) => {
                expect(valor).toBeGreaterThanOrEqual(0);
                expect(valor).toBeLessThanOrEqual([4, 8, 15, 16][i]);
            });
        });

        it('não confunde um 3º argumento legítimo com uma chamada de iteratee', () => {
            stubRandom(QUASE_UM);

            // O array não contém `0` no índice `5`, então a guarda não dispara
            // e o objeto truthy continua valendo como flag `floating`.
            const valor = random(0, 5, [4, 8] as unknown as boolean);
            expect(Number.isInteger(valor)).toBe(false);
            expect(valor).toBeLessThanOrEqual(5);
        });
    });
});
