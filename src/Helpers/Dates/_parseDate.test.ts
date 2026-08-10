import { describe, it, expect } from 'vitest';
import { _parseDate } from './_parseDate';

describe('_parseDate', () => {
    it('retorna null para null, undefined ou string vazia', () => {
        expect(_parseDate(null)).toBeNull();
        expect(_parseDate(undefined)).toBeNull();
        expect(_parseDate('')).toBeNull();
    });

    it('retorna cópia de instância Date válida e null para Date inválida', () => {
        const d = new Date('2026-06-15T12:00:00Z');
        const parsed = _parseDate(d);
        expect(parsed).toBeInstanceOf(Date);
        expect(parsed?.getTime()).toBe(d.getTime());
        expect(parsed).not.toBe(d);

        expect(_parseDate(new Date(NaN))).toBeNull();
    });

    it('interpreta string date-only YYYY-MM-DD no horário local', () => {
        const parsed = _parseDate('2026-06-15');
        expect(parsed).toBeInstanceOf(Date);
        expect(parsed?.getFullYear()).toBe(2026);
        expect(parsed?.getMonth()).toBe(5); // 0-indexed: 5 = junho
        expect(parsed?.getDate()).toBe(15);
    });

    it('interpreta string ISO com fuso/horário', () => {
        const parsed = _parseDate('2026-06-15T14:30:00.000Z');
        expect(parsed).toBeInstanceOf(Date);
        expect(parsed?.toISOString()).toBe('2026-06-15T14:30:00.000Z');
    });

    it('interpreta timestamp numérico e epoch 0', () => {
        const epoch = _parseDate(0);
        expect(epoch).toBeInstanceOf(Date);
        expect(epoch?.getTime()).toBe(0);

        const timestamp = 1770000000000;
        const parsed = _parseDate(timestamp);
        expect(parsed).toBeInstanceOf(Date);
        expect(parsed?.getTime()).toBe(timestamp);
    });

    it('retorna null para entradas inválidas', () => {
        expect(_parseDate('data-invalida')).toBeNull();
        expect(_parseDate(NaN)).toBeNull();
        expect(_parseDate(true)).toBeNull();
        expect(_parseDate({})).toBeNull();
    });
});
