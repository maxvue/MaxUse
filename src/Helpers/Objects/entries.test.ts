import { describe, it, expect } from 'vitest';
import { entries } from './entries';
import { toPairs } from './toPairs';

describe('entries', () => {
    it('é um alias de toPairs', () => {
        expect(entries).toBe(toPairs);
    });

    it('converte objeto em array de pares chave-valor', () => {
        expect(entries({ a: 1, b: 2 })).toEqual([['a', 1], ['b', 2]]);
    });
});
