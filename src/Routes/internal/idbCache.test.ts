import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getFromIDB, setToIDB, deleteFromIDB, clearCacheIDB, resetIDBConnection } from './idbCache';
import { setupIDBMock } from './testing/idbMock';

const idb = setupIDBMock();

describe('idbCache (módulo interno compartilhado)', () => {
    beforeEach(() => {
        idb.reset();
        resetIDBConnection();
        vi.useRealTimers();
    });

    it('grava e recupera uma entrada envelopada', async () => {
        await setToIDB('chave', { id: 1 });
        await expect(getFromIDB('chave')).resolves.toEqual({ hit: true, data: { id: 1 } });
    });

    it('retorna null para chave inexistente', async () => {
        await expect(getFromIDB('ausente')).resolves.toBeNull();
    });

    it('preserva entradas com valores falsy no envelope', async () => {
        await setToIDB('zero', 0);
        await expect(getFromIDB('zero')).resolves.toEqual({ hit: true, data: 0 });

        await setToIDB('empty', '');
        await expect(getFromIDB('empty')).resolves.toEqual({ hit: true, data: '' });

        await setToIDB('false', false);
        await expect(getFromIDB('false')).resolves.toEqual({ hit: true, data: false });
    });

    it('grava a entrada com timestamp', async () => {
        await setToIDB('chave', 'valor');
        expect(idb.mockStore.get('chave')).toMatchObject({ key: 'chave', data: 'valor' });
        expect(typeof idb.mockStore.get('chave').timestamp).toBe('number');
    });

    it('retorna null quando o TTL expirou', async () => {
        await setToIDB('expirada', 'valor');
        idb.mockStore.get('expirada').timestamp = Date.now() - 10_000;

        await expect(getFromIDB('expirada', 1_000)).resolves.toBeNull();
    });

    it('trata ttl = 0 como expiração imediata', async () => {
        await setToIDB('instant', 'valor');
        await expect(getFromIDB('instant', 0)).resolves.toBeNull();
    });

    it('retorna o dado quando o TTL ainda é válido', async () => {
        await setToIDB('fresca', 'valor');
        await expect(getFromIDB('fresca', 60_000)).resolves.toEqual({ hit: true, data: 'valor' });
    });

    it('remove uma entrada específica', async () => {
        await setToIDB('a', 1);
        await setToIDB('b', 2);

        await deleteFromIDB('a');

        expect(idb.mockStore.has('a')).toBe(false);
        expect(idb.mockStore.has('b')).toBe(true);
    });

    it('limpa todo o cache', async () => {
        await setToIDB('a', 1);
        await setToIDB('b', 2);

        await clearCacheIDB();

        expect(idb.mockStore.size).toBe(0);
    });

    it('degrada graciosamente em ambiente SSR (sem indexedDB global)', async () => {
        const originalIDB = global.indexedDB;
        delete (global as any).indexedDB;
        resetIDBConnection();

        await expect(getFromIDB('qualquer')).resolves.toBeNull();
        await expect(setToIDB('qualquer', 1)).resolves.toBeUndefined();
        await expect(deleteFromIDB('qualquer')).resolves.toBeUndefined();
        await expect(clearCacheIDB()).resolves.toBeUndefined();

        global.indexedDB = originalIDB;
    });

    it('memoiza a conexão e reaproveita a mesma promise de banco', async () => {
        await setToIDB('a', 1);
        await setToIDB('b', 2);
        expect(global.indexedDB.open).toHaveBeenCalledTimes(1);
    });

    it('abort de transação rejeita em vez de travar', async () => {
        idb.setAbortError(true);
        await expect(setToIDB('k', { a: 1 })).rejects.toThrow();
    });
});

