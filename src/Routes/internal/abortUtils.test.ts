import { describe, it, expect } from 'vitest';
import { createAbortError, isAbortError } from './abortUtils';

describe('abortUtils (internal)', () => {
    describe('createAbortError', () => {
        it('cria um erro com name AbortError', () => {
            const error = createAbortError();
            expect(error.name).toBe('AbortError');
        });

        it('aceita mensagem customizada', () => {
            const error = createAbortError('cancelado pelo usuário');
            expect(error.message).toBe('cancelado pelo usuário');
        });
    });

    describe('isAbortError', () => {
        it('reconhece o código ERR_CANCELED do axios', () => {
            expect(isAbortError({ code: 'ERR_CANCELED' })).toBe(true);
        });

        it('reconhece CanceledError e AbortError pelo name', () => {
            expect(isAbortError({ name: 'CanceledError' })).toBe(true);
            expect(isAbortError(createAbortError())).toBe(true);
        });

        it('retorna false para erros comuns e valores vazios', () => {
            expect(isAbortError(new Error('falha de rede'))).toBe(false);
            expect(isAbortError(null)).toBe(false);
            expect(isAbortError(undefined)).toBe(false);
        });
    });
});
