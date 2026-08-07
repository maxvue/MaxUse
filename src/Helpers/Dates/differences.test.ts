import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { diffInSeconds, diffInMinutes, diffInHours, diffInDays, diffInMonths, diffInYears } from './differences';

describe('diffInSeconds', () => {
    it('calcula diferença em segundos', () => {
        const d1 = '2026-01-01T00:00:00Z';
        const d2 = '2026-01-01T00:01:00Z';
        expect(diffInSeconds(d1, d2)).toBe(60);
    });

    it('retorna valor absoluto (ordem não importa)', () => {
        const d1 = '2026-01-01T00:01:00Z';
        const d2 = '2026-01-01T00:00:00Z';
        expect(diffInSeconds(d1, d2)).toBe(60);
    });

    it('retorna 0 para mesma data', () => {
        const d = '2026-01-01T00:00:00Z';
        expect(diffInSeconds(d, d)).toBe(0);
    });

    it('retorna 0 para data inválida', () => {
        expect(diffInSeconds('invalid', '2026-01-01')).toBe(0);
    });

    it('retorna 0 para null', () => {
        expect(diffInSeconds(null, '2026-01-01')).toBe(0);
    });

    it('funciona com Ref', () => {
        expect(diffInSeconds(ref('2026-01-01T00:00:00Z'), ref('2026-01-01T00:00:30Z'))).toBe(30);
    });
});

describe('diffInMinutes', () => {
    it('calcula diferença em minutos', () => {
        const d1 = '2026-01-01T00:00:00Z';
        const d2 = '2026-01-01T02:30:00Z';
        expect(diffInMinutes(d1, d2)).toBe(150);
    });
});

describe('diffInHours', () => {
    it('calcula diferença em horas', () => {
        const d1 = '2026-01-01T00:00:00Z';
        const d2 = '2026-01-01T05:00:00Z';
        expect(diffInHours(d1, d2)).toBe(5);
    });
});

describe('diffInDays', () => {
    it('calcula diferença em dias', () => {
        const d1 = '2026-01-01';
        const d2 = '2026-01-11';
        expect(diffInDays(d1, d2)).toBe(10);
    });
});

describe('diffInMonths', () => {
    it('calcula diferença em meses', () => {
        const d1 = '2026-01-15';
        const d2 = '2026-04-15';
        expect(diffInMonths(d1, d2)).toBe(3);
    });

    it('retorna 0 para datas no mesmo mês', () => {
        expect(diffInMonths('2026-06-01T12:00:00Z', '2026-06-28T12:00:00Z')).toBe(0);
    });
});

describe('diffInYears', () => {
    it('calcula diferença em anos', () => {
        expect(diffInYears('2020-01-01', '2026-01-01')).toBe(6);
    });

    it('retorna 0 para datas no mesmo ano', () => {
        expect(diffInYears('2026-01-15T12:00:00Z', '2026-12-15T12:00:00Z')).toBe(0);
    });

    it('retorna 0 se alguma data for null', () => {
        expect(diffInYears(null, '2026-01-01')).toBe(0);
        expect(diffInMonths(null, '2026-01-01')).toBe(0);
    });
});

describe('diffInYears / diffInMonths — regressão auditoria (achado 026)', () => {
    it('não conta 1 dia como 1 ano na virada do calendário', () => {
        expect(diffInYears('2020-12-31', '2021-01-01')).toBe(0);
    });

    it('não conta 1 dia como 1 mês na virada do mês', () => {
        expect(diffInMonths('2026-01-31', '2026-02-01')).toBe(0);
    });

    it('calcula meses completos', () => {
        expect(diffInMonths('2026-01-15', '2026-02-15')).toBe(1);
        expect(diffInMonths('2026-01-15', '2026-02-14')).toBe(0);
        expect(diffInMonths('2026-01-15', '2026-03-15')).toBe(2);
    });

    it('calcula idade corretamente (anos completos)', () => {
        expect(diffInYears('2005-12-31', '2026-01-01')).toBe(20);
        expect(diffInYears('2000-06-15', '2026-06-15')).toBe(26);
        expect(diffInYears('2000-06-15', '2026-06-14')).toBe(25);
    });

    it('é simétrico independente da ordem dos argumentos', () => {
        expect(diffInMonths('2026-03-15', '2026-01-15')).toBe(2);
        expect(diffInYears('2026-01-01', '2005-12-31')).toBe(20);
    });
});
