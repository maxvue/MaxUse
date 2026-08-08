import { describe, it, expect } from 'vitest';
import { attempt } from './attempt';

describe('attempt', () => {
    it('retorna o valor de retorno quando a função não lança', () => {
        expect(attempt((a: number, b: number) => a + b, 1, 2)).toBe(3);
    });

    it('retorna o próprio erro quando a função lança um Error', () => {
        const err = new Error('falhou');
        const result = attempt(() => { throw err; });
        expect(result).toBe(err);
    });

    it('envolve valores não-Error lançados em um novo Error', () => {
        const result = attempt(() => { throw 'string de erro'; }) as Error;
        expect(result).toBeInstanceOf(Error);
        expect(result.message).toBe('string de erro');
    });

    it('envolve número lançado em Error com a mensagem coagida', () => {
        const result = attempt(() => { throw 42; }) as Error;
        expect(result).toBeInstanceOf(Error);
        expect(result.message).toBe('42');
    });

    it('funciona sem argumentos extras', () => {
        expect(attempt(() => 'ok')).toBe('ok');
    });
});
