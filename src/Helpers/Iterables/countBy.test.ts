import { describe, it, expect } from 'vitest';
import { countBy } from './countBy';

describe('countBy', () => {
    it('conta itens onde key === value (padrão value=true)', () => {
        const items = [{ active: true }, { active: true }, { active: false }];
        expect(countBy(items, 'active')).toBe(2);
    });

    it('conta itens onde key === valor especificado', () => {
        const items = [{ status: 'ok' }, { status: 'ok' }, { status: 'error' }];
        expect(countBy(items, 'status', 'ok')).toBe(2);
        expect(countBy(items, 'status', 'error')).toBe(1);
    });

    it('retorna 0 para null ou undefined', () => {
        expect(countBy(null, 'active')).toBe(0);
        expect(countBy(undefined, 'active')).toBe(0);
    });

    it('funciona com Record (object)', () => {
        const items = { a: { active: true }, b: { active: false }, c: { active: true } };
        expect(countBy(items, 'active')).toBe(2);
    });
});
