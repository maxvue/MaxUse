import { describe, it, expect } from 'vitest';
import { uniqueBy } from './uniqueBy';

describe('uniqueBy', () => {
    it('remove duplicatas por string key', () => {
        const items = [{ id: 1, name: 'A' }, { id: 2, name: 'B' }, { id: 1, name: 'A2' }];
        const result = uniqueBy(items, 'id');
        expect(result.length).toBe(2);
    });

    it('remove duplicatas usando função seletora', () => {
        const items = [{ id: 1 }, { id: 2 }, { id: 1 }];
        const result = uniqueBy(items, (item: any) => item.id);
        expect(result.length).toBe(2);
    });

    it('retorna [] para null ou undefined', () => {
        expect(uniqueBy(null, 'id')).toEqual([]);
        expect(uniqueBy(undefined, 'id')).toEqual([]);
    });
});
