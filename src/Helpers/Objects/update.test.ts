import { describe, it, expect } from 'vitest';
import { update } from './update';

describe('update', () => {
    it('atualiza o valor no caminho a partir do valor atual', () => {
        const obj = { a: { b: 2 } };
        update(obj, 'a.b', (n: unknown) => (n as number) * 2);
        expect(obj).toEqual({ a: { b: 4 } });
    });

    it('updater recebe undefined quando o caminho não existe, e cria estrutura', () => {
        const obj: { a: { b: number; c?: number } } = { a: { b: 2 } };
        update(obj, 'a.c', (n: unknown) => (n === undefined ? 5 : (n as number) * 2));
        expect(obj).toEqual({ a: { b: 2, c: 5 } });
    });

    it('retorna intocado para objeto null ou undefined', () => {
        expect(update(null, 'a', () => 1)).toBeNull();
    });

    it('funciona com caminho como array', () => {
        const obj = { a: { b: 1 } };
        update(obj, ['a', 'b'], (n: unknown) => (n as number) + 10);
        expect(obj).toEqual({ a: { b: 11 } });
    });
});
