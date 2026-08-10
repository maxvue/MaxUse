import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { Random, ulid, intervalRandom } from './random';

describe('Random', () => {
    it('gera string com comprimento padrão (20)', () => {
        expect(Random().length).toBe(20);
    });

    it('gera string com comprimento especificado', () => {
        expect(Random(10).length).toBe(10);
    });

    it('gera apenas letras minúsculas por padrão', () => {
        const result = Random(100);
        expect(result).toMatch(/^[a-z]+$/);
    });

    it('gera com letras maiúsculas quando solicitado', () => {
        const result = Random(100, 'upper');
        expect(result).toMatch(/^[A-Z]+$/);
    });

    it('gera com números quando solicitado', () => {
        // O Typecode exige 'lower'|'upper'|'ulid' na string, mas internamente 'number' funciona
        const result = Random(100, 'number lower');
        expect(result).toMatch(/^[a-z0-9]+$/);
    });

    it('gera ULID quando tipo inclui "ulid"', () => {
        const result = Random('ulid');
        expect(result.length).toBe(26);
    });

    // Reatividade
    it('funciona com Ref no comprimento', () => {
        const result = Random(ref(15));
        expect(result.length).toBe(15);
    });

    it('testa args invertidos (string, number)', () => {
        const result = Random('upper' as any, 5);
        expect(result).toMatch(/^[A-Z]+$/);
        expect(result.length).toBe(5);
    });

    it('testa fallback de caracteres se type_code não corresponder a nada válido', () => {
        const result = Random(10, 'invalid' as any);
        expect(result.length).toBe(10);
    });

    it('testa apenas números', () => {
        const result = Random(10, 'number' as any);
        expect(result).toMatch(/^[0-9]+$/);
    });

    it('testa string vazia como params', () => {
        const result = Random('' as any, '' as any);
        expect(result.length).toBe(20);
    });

    it('nonumber gera string sem dígitos', () => {
        expect(Random(50, 'nonumber')).toMatch(/^[a-zA-Z]+$/);
    });

    it.each(['number', 'nonumber', 'letter', 'ulid'] as const)(
        'cobre o Typecode %s', (tipo) => {
            expect(Random(10, tipo)).toBeTruthy();
        }
    );
});

describe('ulid', () => {
    it('gera string de 26 caracteres', () => {
        expect(ulid().length).toBe(26);
    });

    it('gera em minúsculas', () => {
        expect(ulid()).toMatch(/^[a-z0-9]+$/);
    });

    it('gera valores únicos', () => {
        const a = ulid();
        const b = ulid();
        expect(a).not.toBe(b);
    });
});

describe('intervalRandom', () => {
    it('gera número dentro do intervalo', () => {
        for (let i = 0; i < 50; i++) {
            const result = intervalRandom(1, 10);
            expect(result).toBeGreaterThanOrEqual(1);
            expect(result).toBeLessThanOrEqual(10);
        }
    });

    it('retorna inteiro', () => {
        const result = intervalRandom(1, 100);
        expect(Number.isInteger(result)).toBe(true);
    });

    it('funciona com min === max', () => {
        expect(intervalRandom(5, 5)).toBe(5);
    });

    // Reatividade
    it('funciona com Ref', () => {
        const result = intervalRandom(ref(1), ref(1));
        expect(result).toBe(1);
    });
});
