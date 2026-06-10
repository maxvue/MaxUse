import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getCachedApiIDB, clearCacheIDB, deleteFromIDB } from './getCachedApiIDB';
import axios from 'axios';
import * as ziggy from 'ziggy-js';

vi.mock('axios');
vi.mock('ziggy-js', () => ({
    useRoute: vi.fn()
}));

// Mock manual simplificado do IndexedDB
const mockStore = new Map<string, any>();
let mockContainsStore = false;
let mockOpenError = false;
let mockGetError = false;
let mockPutError = false;
let mockDeleteError = false;
let mockClearError = false;

global.indexedDB = {
    open: vi.fn().mockImplementation(() => {
        const request: any = {
            result: {
                objectStoreNames: {
                    contains: vi.fn().mockImplementation(() => mockContainsStore)
                },
                createObjectStore: vi.fn(),
                transaction: vi.fn().mockReturnValue({
                    objectStore: vi.fn().mockReturnValue({
                        get: vi.fn((key) => {
                            const req: any = {};
                            setTimeout(() => {
                                if (mockGetError) {
                                    req.error = new Error('get error');
                                    if (req.onerror) req.onerror();
                                } else {
                                    req.result = mockStore.get(key);
                                    if (req.onsuccess) req.onsuccess();
                                }
                            }, 0);
                            return req;
                        }),
                        put: vi.fn((entry) => {
                            const req: any = {};
                            setTimeout(() => {
                                if (mockPutError) {
                                    req.error = new Error('put error');
                                    if (req.onerror) req.onerror();
                                } else {
                                    mockStore.set(entry.key, entry);
                                    if (req.onsuccess) req.onsuccess();
                                }
                            }, 0);
                            return req;
                        }),
                        delete: vi.fn((key) => {
                            const req: any = {};
                            setTimeout(() => {
                                if (mockDeleteError) {
                                    req.error = new Error('delete error');
                                    if (req.onerror) req.onerror();
                                } else {
                                    mockStore.delete(key);
                                    if (req.onsuccess) req.onsuccess();
                                }
                            }, 0);
                            return req;
                        }),
                        clear: vi.fn(() => {
                            const req: any = {};
                            setTimeout(() => {
                                if (mockClearError) {
                                    req.error = new Error('clear error');
                                    if (req.onerror) req.onerror();
                                } else {
                                    mockStore.clear();
                                    if (req.onsuccess) req.onsuccess();
                                }
                            }, 0);
                            return req;
                        })
                    })
                })
            }
        };
        setTimeout(() => {
            if (mockOpenError) {
                request.error = new Error('open error');
                if (request.onerror) request.onerror();
            } else {
                if (request.onupgradeneeded) request.onupgradeneeded();
                if (request.onsuccess) request.onsuccess();
            }
        }, 0);
        return request;
    })
} as any;


describe('getCachedApiIDB', () => {
    let mockRoute: any;

    beforeEach(async () => {
        vi.clearAllMocks();
        mockStore.clear();
        mockContainsStore = false;
        mockOpenError = false;
        mockGetError = false;
        mockPutError = false;
        mockDeleteError = false;
        mockClearError = false;

        mockRoute = vi.fn((name, params) => `https://example.com/${name}${params && params.id ? '/' + params.id : ''}`);
        (ziggy.useRoute as any).mockReturnValue(mockRoute);
    });

    it('retorna null se routeName for vazio', async () => {
        const result = await getCachedApiIDB('');
        expect(result).toBeNull();
    });

    it('faz requisição se cache estiver vazio e salva no IDB', async () => {
        (axios.get as any).mockResolvedValue({ data: { id: 1, name: 'IDBTest' } });

        const result = await getCachedApiIDB('test.idb', { id: 1 });

        expect(mockRoute).toHaveBeenCalledWith('test.idb', { id: 1 });
        expect(axios.get).toHaveBeenCalled();
        expect(result).toEqual({ id: 1, name: 'IDBTest' });

        const cached = mockStore.get('test.idb_{"id":1}');
        expect(cached.data).toEqual({ id: 1, name: 'IDBTest' });
    });

    it('retorna do cache e não faz requisição', async () => {
        mockStore.set('test.idb_{"id":2}', {
            key: 'test.idb_{"id":2}',
            data: { id: 2, name: 'CachedIDB' },
            timestamp: Date.now()
        });

        const result = await getCachedApiIDB('test.idb', { id: 2 });

        expect(axios.get).not.toHaveBeenCalled();
        expect(result).toEqual({ id: 2, name: 'CachedIDB' });
    });

    it('invalida cache expirado e cobre o catch() da exclusão falha', async () => {
        (axios.get as any).mockResolvedValue({ data: { id: 3, name: 'NewData' } });

        mockStore.set('test.idb_{"id":3}', {
            key: 'test.idb_{"id":3}',
            data: { id: 3, name: 'OldData' },
            timestamp: Date.now() - 5000 // 5s atrás
        });

        mockDeleteError = true; // Para forçar o catch() na linha 66
        const result = await getCachedApiIDB('test.idb', { id: 3 }, null, 1000); // ttl de 1s

        expect(axios.get).toHaveBeenCalled();
        expect(result).toEqual({ id: 3, name: 'NewData' });
    });

    it('pode deletar entry do IDB', async () => {
        mockStore.set('key1', { key: 'key1', data: 'data' });
        await deleteFromIDB('key1');
        expect(mockStore.has('key1')).toBe(false);
    });

    it('pode limpar o banco todo', async () => {
        mockStore.set('key1', { key: 'key1', data: 'data' });
        await clearCacheIDB();
        expect(mockStore.has('key1')).toBe(false);
    });

    it('cobre branch onde a objectStore já existe (contains=true) e branch de dataToRequest=null', async () => {
        mockContainsStore = true;
        (axios.get as any).mockResolvedValue({ data: { id: 99, name: 'StoreExists' } });

        const result = await getCachedApiIDB('test.idb', null);

        expect(mockRoute).toHaveBeenCalledWith('test.idb', {});
        expect(axios.get).toHaveBeenCalled();
        expect(result).toEqual({ id: 99, name: 'StoreExists' });
    });

    it('rejeita promise se houver erro ao abrir o banco', async () => {
        mockOpenError = true;
        await expect(getCachedApiIDB('test.idb', { id: 1 })).rejects.toThrow('open error');
    });

    it('rejeita promise se houver erro no get', async () => {
        mockGetError = true;
        await expect(getCachedApiIDB('test.idb', { id: 1 })).rejects.toThrow('get error');
    });

    it('rejeita promise se houver erro no put', async () => {
        mockPutError = true;
        (axios.get as any).mockResolvedValue({ data: { id: 1, name: 'IDBTest' } });
        await expect(getCachedApiIDB('test.idb', { id: 1 })).rejects.toThrow('put error');
    });

    it('rejeita promise se houver erro no delete', async () => {
        mockDeleteError = true;
        await expect(deleteFromIDB('key1')).rejects.toThrow('delete error');
    });

    it('rejeita promise se houver erro no clear', async () => {
        mockClearError = true;
        await expect(clearCacheIDB()).rejects.toThrow('clear error');
    });
});
