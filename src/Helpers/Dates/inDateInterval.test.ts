import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { inDateInterval, isInDateInterval } from './inDateInterval';

describe('inDateInterval', () => {
    it('retorna true quando data está dentro do intervalo', () => {
        expect(inDateInterval('2026-06-15', { start: '2026-06-01', end: '2026-06-30' })).toBe(true);
    });

    it('retorna false quando data está fora do intervalo', () => {
        expect(inDateInterval('2026-07-15', { start: '2026-06-01', end: '2026-06-30' })).toBe(false);
    });

    it('retorna true quando data é igual ao início', () => {
        expect(inDateInterval('2026-06-01', { start: '2026-06-01', end: '2026-06-30' })).toBe(true);
    });

    it('retorna true quando data é igual ao fim', () => {
        expect(inDateInterval('2026-06-30', { start: '2026-06-01', end: '2026-06-30' })).toBe(true);
    });

    it('retorna false quando data é antes do início', () => {
        expect(inDateInterval('2026-05-01', { start: '2026-06-01', end: '2026-06-30' })).toBe(false);
    });

    it('retorna true quando não há end (sem limite superior)', () => {
        expect(inDateInterval('2099-12-31', { start: '2026-01-01' })).toBe(true);
    });

    it('retorna true quando end é null (sem limite superior)', () => {
        expect(inDateInterval('2099-12-31', { start: '2026-01-01', end: null })).toBe(true);
    });

    it('trata end com época zero (new Date(0)) como limite real', () => {
        expect(inDateInterval('1969-12-31', { start: '1960-01-01', end: new Date(0) })).toBe(true);
        expect(inDateInterval('1971-01-01', { start: '1960-01-01', end: new Date(0) })).toBe(false);
    });

    it('retorna false para data nula ou inválida', () => {
        expect(inDateInterval(null, { start: '2026-01-01' })).toBe(false);
        expect(inDateInterval('invalid', { start: '2026-01-01' })).toBe(false);
    });

    it('retorna false para intervalo nulo ou start inválido', () => {
        expect(inDateInterval('2026-06-15', null as any)).toBe(false);
        expect(inDateInterval('2026-06-15', { start: 'invalid-start' })).toBe(false);
        expect(inDateInterval('2026-06-15', { start: '2026-01-01', end: 'invalid-end' })).toBe(false);
    });

    it('funciona com Ref', () => {
        expect(inDateInterval(ref('2026-06-15'), ref({ start: '2026-06-01', end: '2026-06-30' }))).toBe(true);
    });

    it('funciona com objetos Date', () => {
        expect(inDateInterval(new Date('2026-06-15'), { start: new Date('2026-06-01'), end: new Date('2026-06-30') })).toBe(true);
    });
});

describe('isInDateInterval (alias)', () => {
    it('funciona como inDateInterval', () => {
        expect(isInDateInterval('2026-06-15', { start: '2026-06-01', end: '2026-06-30' })).toBe(true);
    });

    it('é referência de inDateInterval', () => {
        const result = isInDateInterval('2026-07-15', { start: '2026-06-01', end: '2026-06-30' });
        expect(result).toBe(false);
    });
});
