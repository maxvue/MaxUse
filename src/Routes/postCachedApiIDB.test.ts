import { describe, it, expect, vi, beforeEach } from 'vitest';
import { postCachedApiIDB } from './postCachedApiIDB';
import axios from 'axios';
import * as config from './config';

vi.mock('axios');
vi.mock('./config', () => ({
    resolveRoute: vi.fn(),
    hasRoute: vi.fn(),
    getConfiguredHeaders: vi.fn(() => ({})),
    getWithCredentials: vi.fn(() => true),
    resetConfig: vi.fn()
}));

// Mock manual simplificado do IndexedDB
const mockStore = new Map<string, any>();
let mockContainsStore = false;
let mockOpenError = false;
let mockGetError = false;
let mockPutError = false;
let mockDeleteError = false;

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

describe('postCachedApiIDB', () => {
    beforeEach(async () => {
        vi.clearAllMocks();
        mockStore.clear();
        mockContainsStore = false;
        mockOpenError = false;
        mockGetError = false;
        mockPutError = false;
        mockDeleteError = false;

        (config.resolveRoute as any).mockImplementation((name: string, params: any) =>
            `https://example.com/${name}${params && params.id ? '/' + params.id : ''}`
        );
        (config.getConfiguredHeaders as any).mockReturnValue({});
        (config.getWithCredentials as any).mockReturnValue(true);
    });

    it('retorna null se routeName for vazio', async () => {
        const result = await postCachedApiIDB('');
        expect(result).toBeNull();
    });

    it('faz requisição POST se cache estiver vazio e salva no IDB', async () => {
        (axios.post as any).mockResolvedValue({ data: { id: 1, name: 'PostIDBTest' } });

        const result = await postCachedApiIDB('test.post', { id: 1 }, { campo: 'valor' });

        expect(config.resolveRoute).toHaveBeenCalledWith('test.post', { id: 1 });
        expect(axios.post).toHaveBeenCalledWith(
            'https://example.com/test.post/1',
            { campo: 'valor' },
            expect.objectContaining({
                responseType: 'json',
                withCredentials: true,
                headers: expect.objectContaining({
                    'Content-Type': 'application/json'
                })
            })
        );
        expect(result).toEqual({ id: 1, name: 'PostIDBTest' });

        const cacheKey = 'test.post_{"id":1}_{"campo":"valor"}';
        const cached = mockStore.get(cacheKey);
        expect(cached.data).toEqual({ id: 1, name: 'PostIDBTest' });
    });

    it('retorna do cache e não faz requisição', async () => {
        const cacheKey = 'test.post_{"id":2}_{"campo":"valor2"}';
        mockStore.set(cacheKey, {
            key: cacheKey,
            data: { id: 2, name: 'CachedPostIDB' },
            timestamp: Date.now()
        });

        const result = await postCachedApiIDB('test.post', { id: 2 }, { campo: 'valor2' });

        expect(axios.post).not.toHaveBeenCalled();
        expect(result).toEqual({ id: 2, name: 'CachedPostIDB' });
    });

    it('invalida cache expirado e cobre o catch() da exclusão falha', async () => {
        (axios.post as any).mockResolvedValue({ data: { id: 3, name: 'NewPostData' } });

        const cacheKey = 'test.post_{"id":3}_{"campo":"valor3"}';
        mockStore.set(cacheKey, {
            key: cacheKey,
            data: { id: 3, name: 'OldPostData' },
            timestamp: Date.now() - 5000 // 5s atrás
        });

        mockDeleteError = true; // Para forçar o catch() na exclusão
        const result = await postCachedApiIDB('test.post', { id: 3 }, { campo: 'valor3' }, null, 1000); // ttl de 1s

        expect(axios.post).toHaveBeenCalled();
        expect(result).toEqual({ id: 3, name: 'NewPostData' });
    });

    it('usa keyCache personalizada quando fornecida', async () => {
        (axios.post as any).mockResolvedValue({ data: { id: 4, name: 'CustomKey' } });

        const result = await postCachedApiIDB('test.post', { id: 4 }, { campo: 'valor4' }, 'minha_chave_customizada');

        expect(result).toEqual({ id: 4, name: 'CustomKey' });

        const cached = mockStore.get('minha_chave_customizada');
        expect(cached.data).toEqual({ id: 4, name: 'CustomKey' });
    });

    it('cobre branch onde a objectStore já existe (contains=true) e routeParams/postData=null', async () => {
        mockContainsStore = true;
        (axios.post as any).mockResolvedValue({ data: { id: 99, name: 'StoreExists' } });

        const result = await postCachedApiIDB('test.post', null, null);

        expect(config.resolveRoute).toHaveBeenCalledWith('test.post', {});
        expect(axios.post).toHaveBeenCalledWith(
            'https://example.com/test.post',
            {},
            expect.any(Object)
        );
        expect(result).toEqual({ id: 99, name: 'StoreExists' });
    });

    it('inclui headers configurados via setApiRequestConfig', async () => {
        (config.getConfiguredHeaders as any).mockReturnValue({ 'Authorization': 'Bearer test-token' });
        (axios.post as any).mockResolvedValue({ data: { id: 5, name: 'WithAuth' } });

        await postCachedApiIDB('test.post', null, { campo: 'valor5' });

        expect(axios.post).toHaveBeenCalledWith(
            expect.any(String),
            { campo: 'valor5' },
            expect.objectContaining({
                headers: expect.objectContaining({
                    'Authorization': 'Bearer test-token'
                })
            })
        );
    });

    it('rejeita promise se houver erro ao abrir o banco', async () => {
        mockOpenError = true;
        await expect(postCachedApiIDB('test.post', { id: 1 }, { campo: 'valor' })).rejects.toThrow('open error');
    });

    it('rejeita promise se houver erro no get', async () => {
        mockGetError = true;
        await expect(postCachedApiIDB('test.post', { id: 1 }, { campo: 'valor' })).rejects.toThrow('get error');
    });

    it('rejeita promise se houver erro no put', async () => {
        mockPutError = true;
        (axios.post as any).mockResolvedValue({ data: { id: 1, name: 'PostIDBTest' } });
        await expect(postCachedApiIDB('test.post', { id: 1 }, { campo: 'valor' })).rejects.toThrow('put error');
    });
});
