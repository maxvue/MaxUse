import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getFromIDB, setToIDB, deleteFromIDB, clearCacheIDB } from './idbCache';

// Mock manual do IndexedDB, no mesmo formato usado pelos testes dos helpers.
const mockStore = new Map<string, any>();

const makeRequest = (run: (req: any) => void) => {
    const req: any = {};
    setTimeout(() => run(req), 0);
    return req;
};

global.indexedDB = {
    open: vi.fn().mockImplementation(() => makeRequest((req) => {
        req.result = {
            objectStoreNames: { contains: () => true },
            createObjectStore: vi.fn(),
            transaction: () => ({
                objectStore: () => ({
                    get: (key: string) => makeRequest((r) => {
                        r.result = mockStore.get(key);
                        r.onsuccess?.();
                    }),
                    put: (entry: any) => makeRequest((r) => {
                        mockStore.set(entry.key, entry);
                        r.onsuccess?.();
                    }),
                    delete: (key: string) => makeRequest((r) => {
                        mockStore.delete(key);
                        r.onsuccess?.();
                    }),
                    clear: () => makeRequest((r) => {
                        mockStore.clear();
                        r.onsuccess?.();
                    })
                })
            })
        };
        req.onsuccess?.();
    }))
} as any;

describe('idbCache (módulo interno compartilhado)', () => {
    beforeEach(() => {
        mockStore.clear();
        vi.useRealTimers();
    });

    it('grava e recupera uma entrada', async () => {
        await setToIDB('chave', { id: 1 });
        await expect(getFromIDB('chave')).resolves.toEqual({ id: 1 });
    });

    it('retorna null para chave inexistente', async () => {
        await expect(getFromIDB('ausente')).resolves.toBeNull();
    });

    it('grava a entrada com timestamp', async () => {
        await setToIDB('chave', 'valor');
        expect(mockStore.get('chave')).toMatchObject({ key: 'chave', data: 'valor' });
        expect(typeof mockStore.get('chave').timestamp).toBe('number');
    });

    it('retorna null quando o TTL expirou', async () => {
        await setToIDB('expirada', 'valor');
        // Envelhece a entrada além do TTL
        mockStore.get('expirada').timestamp = Date.now() - 10_000;

        await expect(getFromIDB('expirada', 1_000)).resolves.toBeNull();
    });

    it('retorna o dado quando o TTL ainda é válido', async () => {
        await setToIDB('fresca', 'valor');
        await expect(getFromIDB('fresca', 60_000)).resolves.toBe('valor');
    });

    it('remove uma entrada específica', async () => {
        await setToIDB('a', 1);
        await setToIDB('b', 2);

        await deleteFromIDB('a');

        expect(mockStore.has('a')).toBe(false);
        expect(mockStore.has('b')).toBe(true);
    });

    it('limpa todo o cache', async () => {
        await setToIDB('a', 1);
        await setToIDB('b', 2);

        await clearCacheIDB();

        expect(mockStore.size).toBe(0);
    });
});
