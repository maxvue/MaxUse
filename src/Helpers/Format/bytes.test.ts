import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { formatBytes } from './bytes';

describe('formatBytes', () => {
    it('formata 0 bytes', () => {
        expect(formatBytes(0)).toBe('0 Bytes');
    });

    it('formata 0 bytes', () => {
        expect(formatBytes(NaN)).toBe('0 Bytes');
    });

    it('formata bytes (< 1KB)', () => {
        expect(formatBytes(500)).toBe('500 Bytes');
    });

    it('formata KB', () => {
        expect(formatBytes(1024)).toBe('1 KB');
    });

    it('formata KB String b', () => {
        expect(formatBytes('1024b')).toBe('1 KB');
    });

    it('formata KB String B', () => {
        expect(formatBytes('1024B')).toBe('1 KB');
    });

    it('formata KB String Bytes', () => {
        expect(formatBytes('1024Bytes')).toBe('1 KB');
    });

    it('formata KB String Bytes', () => {
        expect(formatBytes('1024 Bytes')).toBe('1 KB');
    });

    it('formata KB String BYTES', () => {
        expect(formatBytes('1024Bytes')).toBe('1 KB');
    });

    it('formata MB', () => {
        expect(formatBytes(1048576)).toBe('1 MB');
    });

    it('formata GB', () => {
        expect(formatBytes(1073741824)).toBe('1 GB');
    });

    it('formata com casas decimais customizadas', () => {
        expect(formatBytes(1536, 1)).toBe('1.5 KB');
    });

    it('formata NaN como 0 Bytes', () => {
        expect(formatBytes('abc')).toBe('0 Bytes');
    });

    it('formata com casas decimais negativas (usa 0)', () => {
        expect(formatBytes(1536, -1)).toBe('2 KB');
    });

    it('funciona com Ref', () => {
        expect(formatBytes(ref(2048))).toBe('2 KB');
    });
});

describe('formatBytes — regressão auditoria (achado 014)', () => {
    it('trata valores negativos em vez de retornar "NaN undefined"', () => {
        expect(formatBytes(-1024)).toBe('-1 KB');
        expect(formatBytes(-1048576)).toBe('-1 MB');
    });

    it('não estoura o array de sufixos para valores enormes', () => {
        expect(formatBytes(1e30)).toMatch(/YB$/);
        expect(formatBytes(1e30)).not.toContain('undefined');
    });

    it('trata vírgula como separador decimal (pt-BR)', () => {
        expect(formatBytes('1,5')).toBe('1.5 Bytes');
    });

    it('preserva o sinal negativo em strings', () => {
        expect(formatBytes('-1024')).toBe('-1 KB');
    });

    it('formata valores fracionários entre 0 e 1 sem sufixo undefined', () => {
        expect(formatBytes(0.5)).toBe('0.5 Bytes');
        expect(formatBytes(-0.5)).toBe('-0.5 Bytes');
        expect(formatBytes('0,5')).toBe('0.5 Bytes');
    });

    it('interpreta strings pt-BR com milhar e decimal', () => {
        expect(formatBytes('1.234,5')).toBe('1.21 KB');
        expect(formatBytes('1.024')).toBe('1 KB');
    });

    it('não fabrica números a partir de notação científica', () => {
        expect(formatBytes('2e3')).not.toBe('23 Bytes');
    });

    it('promove o sufixo quando o arredondamento atinge 1024', () => {
        expect(formatBytes(1023.9999)).toBe('1 KB');
    });

    it('trata Infinity como entrada inválida', () => {
        expect(formatBytes(Infinity)).toBe('0 Bytes');
    });
});
