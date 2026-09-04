import { describe, it, expect } from 'vitest';
import { countWhere } from './countWhere';

describe('countWhere', () => {
    it('conta itens onde key === value (padrão value=true)', () => {
        const items = [{ active: true }, { active: true }, { active: false }];
        expect(countWhere(items, 'active')).toBe(2);
    });

    it('conta itens onde key === valor especificado', () => {
        const items = [{ status: 'ok' }, { status: 'ok' }, { status: 'error' }];
        expect(countWhere(items, 'status', 'ok')).toBe(2);
        expect(countWhere(items, 'status', 'error')).toBe(1);
    });

    it('retorna 0 para null ou undefined', () => {
        expect(countWhere(null, 'active')).toBe(0);
        expect(countWhere(undefined, 'active')).toBe(0);
    });

    it('funciona com Record (object)', () => {
        const items = { a: { active: true }, b: { active: false }, c: { active: true } };
        expect(countWhere(items, 'active')).toBe(2);
    });
});
